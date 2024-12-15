import asyncio
import websockets
import json
import random
import time 
import threading

LARGURA_TELA = 1300
LARGURA_QUADRADOS = 30
DELAY = 60
QUANTIDADE_QUADRADOS = 3
fechado = False
cores = ["#3498db", "#059669", "#b45309", "#3b0764", "#facc15"]
probabilidades = [100/QUANTIDADE_QUADRADOS] * QUANTIDADE_QUADRADOS

def calcularProbabilidades():
    global probabilidades
    # Calcular o tempo restante para cada cavalo
    tempos_restantes = [
        (LARGURA_TELA - quadrado["posX"]) / quadrado["velocidade"] 
        for quadrado in quadrados
    ]
    
    # Determinar odds ajustadas com base no inverso do tempo restante
    novasProbabilidades = [
        1 / (tempo ** 3) if tempo > 0 else 0  # Menor tempo -> maior probabilidade
        for tempo in tempos_restantes
    ]
    
    # Normalizar as probabilidades para que somem 1 (ou 100%)
    total_probabilidades = sum(novasProbabilidades)
    probabilidades = [prob / total_probabilidades for prob in novasProbabilidades]

def rodarEmThread():
    while True:
        if not(fechado):
            calcularProbabilidades()
        time.sleep(1)

def inicializar_quadrados():
    return [
        {
            "id": index,
            "posX": 0,
            "velocidade": random.random() + 1,
            "ativo": True,
            "nitroAtivo": False,
            "tempoNitro": 0,
            "cor": cores[index],
        }
        for index in range(QUANTIDADE_QUADRADOS)
    ]


async def move_squares(websocket, path):
    global quadrados, campeao
    async for message in websocket:
        if message == "start":                
            quadrados = inicializar_quadrados()
            thread = threading.Thread(target=rodarEmThread, daemon=True)
            thread.start()
            while True:
                mover_quadrados()
                existe_ativo_false = list(filter(lambda quadrado: quadrado["ativo"] == False, quadrados))
                await websocket.send(json.dumps(
                    {"quadrados": quadrados, "odds": 
                    [round(1/prob, 2) for prob in probabilidades],
                    "closedForBets": fechado,
                    "winner": existe_ativo_false[0] if existe_ativo_false else None
                    }
                    ))
                if existe_ativo_false: 
                    break
                
                if random.random() < 0.01:  # 1% de chance a cada loop de chamar o nitro
                    ativar_nitro()
                await asyncio.sleep(DELAY/1000)


def ativar_nitro():
    quadrado_aleatorio = random.randint(0, 4)

    for quadrado in quadrados:
        if quadrado["id"] == quadrado_aleatorio:
            duracao_nitro = random.uniform(1000, 2000)
            quadrado.update({
                "nitroAtivo": quadrado["ativo"],
                "tempoNitro": duracao_nitro,
            })

def mover_quadrados():
    for quadrado in quadrados:
        if not quadrado["ativo"]:
            continue

        nova_velocidade = quadrado["velocidade"]
        if quadrado["nitroAtivo"]:
            nova_velocidade *= 2

        nova_posX = quadrado["posX"] + nova_velocidade

        if nova_posX > LARGURA_TELA - LARGURA_QUADRADOS:
            nova_posX = LARGURA_TELA - LARGURA_QUADRADOS
            quadrado.update({
                "posX": nova_posX,
                "ativo": False,
                "nitroAtivo": False,
                "tempoNitro": 0,
            })
            continue

        if quadrado["nitroAtivo"]:
            tempo_restante = quadrado["tempoNitro"] - 16
            if tempo_restante <= 0:
                quadrado.update({
                    "nitroAtivo": False,
                    "tempoNitro": 0,
                })
            else:
                quadrado.update({
                    "tempoNitro": tempo_restante,
                    "posX": nova_posX,
                })
        else:
            quadrado.update({
                "posX": nova_posX,
            })
    global fechado
    fechado = any(quadrado["posX"] > LARGURA_TELA/2 for quadrado in quadrados)

async def main():
    async with websockets.serve(move_squares, "localhost", 8765):
        await asyncio.Future()  # runs forever

if __name__ == "__main__":
    asyncio.run(main())
