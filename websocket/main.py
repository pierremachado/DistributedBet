import asyncio
import websockets
import json
import random

LARGURA_TELA = 1300
LARGURA_QUADRADOS = 30
DELAY = 32
QUANTIDADE_QUADRADOS = 3
cores = ["#3498db", "#059669", "#b45309", "#3b0764", "#facc15"]
probabilidades = [100/QUANTIDADE_QUADRADOS] * QUANTIDADE_QUADRADOS

def calcularProbabilidades():
    global probabilidades
    tempos_restantes = [
        (LARGURA_TELA - quadrado["posX"])/quadrado["velocidade"] 
        for quadrado in quadrados]
    total_tempo = sum(tempos_restantes)
    novasProbabilidades = [(total_tempo-tempo)/total_tempo for tempo in tempos_restantes]
    total_probabilidades = sum(novasProbabilidades) * 105/100
    probabilidades = [prob/total_probabilidades for prob in novasProbabilidades]
    

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

quadrados = inicializar_quadrados()

async def move_squares(websocket, path):

    while True:
        mover_quadrados()
        await websocket.send(json.dumps({"quadrados": quadrados, "odds": 
            [round(1/prob, 2) for prob in probabilidades]}))
        existe_ativo_false = any(quadrado["ativo"] == False for quadrado in quadrados)
        if existe_ativo_false: break
        
        if random.random() < 0.01:  # 10% de chance a cada loop de chamar o nitro
            ativar_nitro()
        await asyncio.sleep(0.032)


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
            tempo_restante = quadrado["tempoNitro"] - 32
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
            
    calcularProbabilidades()

async def main():
    async with websockets.serve(move_squares, "localhost", 8765):
        await asyncio.Future()  # runs forever

if __name__ == "__main__":
    asyncio.run(main())
