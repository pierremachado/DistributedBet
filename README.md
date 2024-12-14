# DistributedBet

### Equipe

[![Pierre Machado](https://github.com/pierremachado.png?size=20)](https://github.com/pierremachado) [Pierre Machado](https://github.com/pierremachado)

[![Valmir Nogueira](https://github.com/valmirnogfilho.png?size=20)](https://github.com/valmirnogfilho) [Valmir Nogueira](https://github.com/valmirnogfilho)

## Introdução

Atualmente, o mercado de apostas cresce de forma exponencial, impulsionado pela ampla variedade de opções, como apostas esportivas e jogos de cassino. Esse cenário atrai um número crescente de clientes e movimenta bilhões de dólares globalmente. Além disso, a popularização da internet tornou as apostas online mais acessíveis e práticas, ampliando o alcance desse mercado.

Diante desse fato, este relatório descreve o desenvolvimento de um software distribuído para criação de apostas. O sistema permitirá que os usuários criem eventos para apostas e realizem pagamentos em eventos criados por outros na rede. O objetivo principal é implementar uma solução totalmente descentralizada, garantindo que o bloqueio de um único "nó" não comprometa o funcionamento completo do sistema.

O back-end do projeto foi desenvolvido utilizando contratos inteligentes escritos em Solidity, projetados para operar na blockchain Ethereum. A construção do projeto ocorreu no ambiente HardHat, onde os contratos foram compilados, implantados e testados.

## Discussão teórica

Essa seção possui o objetivo de discorrer sobre a teoria utilizada para a solução do problema. Os conceitos principais sobre sistemas distribuídos serão apresentados e detalhados.

### 1. Sistemas distribuídos

Define-se um sistema distribuído como “um conjunto de computadores independentes que se apresenta aos seus usuários como um sistema único e coerente” (TANENBAUM, 2007, p. 1). Segundo o autor, as principais características de um sistema distribuído incluem a ocultação da organização dos computadores para os usuários e o acesso consistente e uniforme ao sistema. Isso significa que quaisquer alterações realizadas por um usuário ou aplicação devem ser refletidas de maneira consistente em todo o sistema.

Projetar um sistema distribuído apresenta vantagens claras, mas também traz desafios inerentes à sua natureza. Uma de suas principais vantagens é a alta disponibilidade, que se configura como um dos objetivos fundamentais desses sistemas.

Segundo Zettler, os sistemas distribuídos visam eliminar gargalos e pontos centrais de falha (s.d.). Pontos centrais de falha são pontos na rede cujo comprometimento afeta o funcionamento do sistema por completo (DOOLEY, 2001). Os servidores introduzidos na rede e que oferecem uma aplicação acessível por meio da arquitetura cliente-servidor, onde tais servidores possuem apenas um “nó” central, estão expostos a eventuais falhas. Tais falhas podem se caracterizar como falhas de rede (alta latência, inoperância) ou falhas catastróficas de hardware, por exemplo. Torna-se inviável assumir que esses tipos de falha nunca ocorrerão (KLEPPMANN, 2020).

Kleppmann aponta que mitigar falhas é essencial para que indivíduos ou empresas minimizem os prejuízos ocorridos durante um período de inoperância de seus serviços (2020). Nesse contexto, os sistemas distribuídos têm como objetivo principal reduzir as vulnerabilidades de sistemas conectados à rede. Além disso, permitem dividir um programa em diferentes microsserviços, promovendo a comunicabilidade entre esses serviços e até mesmo entre aplicações de empresas distintas. Por exemplo, um aplicativo de compras não precisa desenvolver um serviço de pagamento do zero; ele pode estabelecer parcerias com bancos ou empresas especializadas e integrar seus serviços por meio de execuções remotas de procedimentos entre esses serviços na rede.

Outra característica relevante, segundo Tanenbaum, é o compartilhamento de recursos de alto custo, como supercomputadores e sistemas de armazenamento de alto desempenho (2007). Esses dispositivos permitem armazenar e executar aplicações de forma compartilhada, reduzindo os custos relacionados a hardware e tornando o sistema mais eficiente economicamente.

Os sistemas distribuídos alcançam flexibilidade e escalabilidade ao dividir aplicações entre diferentes "nós" interconectados em uma malha distribuída pela rede. Esses "nós" podem estar localizados em diferentes localizações geográficas, embora isso não seja uma exigência. No entanto, esses sistemas estão sujeitos a falhas específicas, distintas das enfrentadas por um servidor centralizado. Falhas de rede ainda são previstas, mas os sistemas distribuídos devem ser projetados para tolerar o mau funcionamento de um ou mais "nós" sem comprometer o funcionamento geral do sistema (KLEPPMANN, 2020).

Portanto, para que um sistema distribuído que implemente bancos de dados garanta as propriedades de atomicidade, consistência, isolamento e durabilidade, é necessário lidar com diferentes situações relacionadas às redes, ao tempo e aos comportamentos dos nós. Essas questões exigem abordagens específicas que serão discutidas nos tópicos a seguir.

### 2. Assunções de modelagem do sistema

Kleppmann destaca que conexões de rede não são confiáveis, estando sujeitas a atrasos inesperados ou até à perda completa de pacotes (2020). Dessa forma, um sistema distribuído deve considerar essas limitações e estar preparado para lidar com asserções de rede. Também podem ocorrer variações no comportamento dos "nós" e condições temporais imprevisíveis.

São as asserções de comportamentos de redes:
- Links confiáveis (reliable links): as mensagens são entregues se e somente se forem enviadas. Além disso, assumem que todas as mensagens enviadas serão recebidas, mas que também podem ser reordenadas.
- Links de perda justa (fair-loss links): mensagens podem ser atrasadas, recebidas na ordem errada ou até mesmo não serem recebidas de forma alguma. Se o envio de uma mensagem for tentado mais de uma vez, eventualmente a mensagem chegará.
- Links arbitrários (adversário ativo): um adversário externo pode interferir nas mensagens. Alguns exemplos incluem modificação de mensagens, espionagem ou spoofing, ato de fingir ser alguém ou algo confiável (KASPERSKY, s.d.)

Assumir que um sistema distribuído de apostas opera com links confiáveis não é uma abordagem segura. A rede está sujeita a instabilidades, e os "nós" podem estar distribuídos geograficamente. Nessas condições, a perda de comunicação com outros "nós" impede que um "nó" isolado realize operações de forma independente. O sistema deve estar projetado para funcionar sem o “nó” instável. Além disso, também é assumido que adversários ativos podem interferir no sistema, configurando uma falha bizantina (KLEPPMANN, 2020). Uma falha bizantina é caracterizada “quando um ou mais componentes [do sistema] falham e não há informações precisas sobre se um componente falhou ou se as informações do sistema estão corretas” (MALDONADO, 2019). 

São assunções de funcionamento dos “nós”:
- Crash-stop: assim que um “nó” falha, ele para de ser executado para sempre.
- Crash-recovery: um “nó” pode falhar a qualquer momento, interrompendo a sua execução e perdendo todo o seu estado de memória interno atual. Um “nó” defeituoso pode ter a sua execução retomada a qualquer momento.
- Bizantino (falha arbitrária): um “nó” é defeituoso se ele desvia do algoritmo. Nós defeituosos podem ter comportamentos indesejados, desde a terem a execução interrompida, como um comportamento indesejado.

Dadas as assunções sobre os funcionamentos dos “nós” acima, a alternativa mais segura seria assumir o modelo de falha arbitrária (comportamento bizantino). Ter o funcionamento do sistema invadido e comprometido poderia acarretar em grandes perdas para as partes atuantes do sistema. Em decorrência disso, torna-se essencial implementar medidas de proteção robustas.

Por fim, são assunções do modelo de comportamento temporal:
- Síncrono: a latência de mensagens não ultrapassa um limite superior conhecido. Os “nós” operam a uma velocidade uniforme e previsível.
- Parcialmente síncrono: os “nós” geralmente operam a uma velocidade previsível, mas podem agir de forma assíncrona em períodos de tempo finitos. Pode ocorrer em forma de atraso de mensagens ou demora de execução.
- Assíncrono: não se sabe ao certo quanto tempo uma mensagem levará para ser recebida, nem quando um “nó” terá a sua execução pausada. Isso é válido para todo “nó” do sistema.

Kleppmann argumenta que assumir um sistema como síncrono é irrealista (2020). Algoritmos projetados com essa premissa podem sofrer falhas graves caso o sistema opere de forma assíncrona. Por outro lado, certos problemas são insolúveis sob a suposição de um sistema totalmente assíncrono. Assim, a abordagem mais segura é considerar o modelo parcialmente síncrono. Esse modelo representa um equilíbrio entre as duas assunções, permitindo a modelagem de um sistema distribuído que continue funcionando mesmo diante de aumento na latência, pertubações na rede ou interrupções temporárias na execução de “nós”.

### 3. Propriedades ACID

Em um sistema distribuído, como o de apostas, as transações desempenham um papel essencial na manutenção da integridade dos dados. De acordo com a empresa de dados Databricks, uma transação em um banco de dados é "qualquer operação tratada como uma unidade de trabalho. As transações são totalmente executadas ou não executadas, mantendo o sistema de armazenamento em um estado consistente" (s.d.). Essas características eliminam a possibilidade de estados intermediários. Em um sistema de apostas distribuídas, por exemplo, se um usuário decide apostar uma quantia, a operação será concluída apenas se houver saldo suficiente. Não há espaço para um estado intermediário em que a aposta simultaneamente exista e não exista.

Neste caso, conforme aponta Databricks (s.d.), um banco de dados distribuído deve implementar as seguintes propriedades:

- Atomicidade: as etapas de uma transação, como no caso de uma aposta debitar o saldo atual e inserir o endereço de identificação do usuário na lista de apostadores, são tratadas como uma única operação indivisível. Todas as instruções devem ser concluídas com sucesso. Caso contrário, nenhuma delas será aplicada, garantindo a integridade dos dados e evitando perdas ou corrupções.
- Consistência: segundo a IBM, os dados devem estar em “um estado consistente quando uma transação começa e quando ela termina” (2022). Por exemplo, ao depositar uma quantia de dinheiro, o sistema deve garantir que o saldo do apostador seja incrementado corretamente, sem gerar discrepâncias nos dados.
- Isolamento: mesmo que duas ou mais transações ocorram simultaneamente, seus estados intermediários devem permanecer invisíveis umas às outras. Assim, uma transação em andamento não deve ser interferida ou impactada por outra.
- Durabilidade: após a conclusão de uma transação, as alterações nos dados devem ser permanentes, mesmo em caso de falhas catastróficas. Por exemplo, uma aposta criada com sucesso não pode ser revertida posteriormente devido a uma falha inesperada no sistema.

Essas propriedades são, portanto, fundamentais para a construção de um sistema robusto. Contudo, a natureza distribuída dos sistemas frequentemente apresenta desafios. Para superá-los, é essencial implementar protocolos que assegurem uma comunicação eficiente e consistente entre os "nós" do sistema.

### 4. Teorema CAP

O teorema CAP delineia três pilares fundamentais para o desenvolvimento de sistemas distribuídos. De acordo com a IBM (s.d.), esses pilares são:

- Consistência (Consistency): todos os "nós" do sistema apresentam os mesmos dados ao mesmo tempo, garantindo que qualquer leitura retorne a versão mais recente escrita.
- Disponibilidade (Availability): o sistema permanece operacional e responde a todas as requisições, mesmo que algumas falhas ocorram.
- Tolerância à partição (Partition Tolerance): o sistema continua a operar mesmo que a comunicação entre "nós" seja interrompida.
	
O teorema CAP demonstra que sistemas distribuídos enfrentam limitações inerentes, sendo impossível alcançar simultaneamente consistência, disponibilidade e tolerância à partição. Tanenbaum explica:

> *“Uma forma de entender o teorema é pensar que dois processos são incapazes de se comunicarem por causa de uma rede se comportando de forma anômala. Permitir que um processo aceite atualizações leva a inconsistências, então só podemos ter as propriedades {C, P}. Se a ilusão de consistência deve ser providenciada enquanto os dois processos não podem se comunicar, então um dos processos precisará fingir que está indisponível, implicando haver apenas {A, P}. Entretanto, apenas se os dois processos podem se comunicar, é possível manter tanto consistência quanto alta disponibilidade, significando que temos apenas {C, A}, mas não mais a propriedade P.”*  
> *(TANENBAUM, 2007, tradução nossa)*

No caso de um sistema distribuído de apostas, priorizar a tolerância à partição é essencial, devido à alta probabilidade de falhas na comunicação entre os “nós”. Entre consistência e disponibilidade, a consistência deve ser priorizada, pois assegurar que as transações e os dados sejam precisos e confiáveis é fundamental para preservar a integridade do sistema. Embora a disponibilidade possa ser afetada em situações de falha, é preferível que o sistema pause temporariamente a aceitação de novas operações do que comprometer sua consistência.

### 5. Consenso

O consenso é uma das bases para o funcionamento de sistemas distribuídos. Ele garante que todos os nós participantes concordem com o estado atual da rede, mesmo em cenários de falhas ou comportamentos maliciosos. Em sistemas descentralizados, o consenso elimina a necessidade de uma autoridade central, assegurando que as transações sejam registradas de maneira confiável e uniforme.

Os algoritmos de consenso mais utilizados incluem:

- Prova de Trabalho (Proof of Work - PoW): consiste na resolução de cálculos matemáticos complexos para validar transações e criar novos blocos. É seguro, mas demanda alto consumo de energia.

- Prova de Participação (Proof of Stake - PoS): seleciona validadores com base na quantidade de recursos bloqueados como garantia. É mais eficiente energeticamente que o PoW.

- Byzantine Fault Tolerance (BFT): tolerante a até certo número de nós defeituosos ou maliciosos, garantindo integridade mesmo em redes com comportamentos adversos.

Esses mecanismos são projetados para resolver problemas como o gasto duplo e assegurar a integridade das informações armazenadas. Eles são fundamentais para aplicações que requerem descentralização, como os sistemas baseados em blockchains.

### 6. Ledger distribuído

O ledger distribuído é um modelo de armazenamento que organiza registros de forma replicada em múltiplos nós de uma rede. Essa abordagem descentralizada garante que todos os participantes possuam uma cópia idêntica do histórico de transações, promovendo maior segurança e confiança no sistema.

Os registros em um ledger distribuído são imutáveis, ou seja, uma vez adicionados, não podem ser alterados sem o consenso da rede. Essa característica torna o modelo ideal para auditorias e aplicações que exigem transparência.

Os ledgers distribuídos trazem como principais benefícios:

- Imutabilidade: impede alterações nos dados sem aprovação dos participantes.

- Descentralização: reduz o risco de falhas sistêmicas ou manipulação.

- Segurança: mesmo com falhas em alguns nós, os dados permanecem protegidos.

A estrutura de ledger distribuído é frequentemente usada como base para tecnologias descentralizadas, incluindo blockchains, que levam essas vantagens a um nível superior de aplicação.

### 7. Peer to Peer

O modelo peer-to-peer (P2P) é uma arquitetura de rede em que cada nó pode atuar tanto como cliente quanto como servidor, eliminando a dependência de um ponto central. Nesse sistema, os nós se comunicam diretamente, compartilhando dados de forma descentralizada e colaborativa.

Algumas vantagens do modelo P2P incluem:

- Escalabilidade: a capacidade da rede cresce conforme mais nós participam.

- Resiliência: a ausência de um ponto único de falha aumenta a robustez do sistema.

- Eficiência: a latência é reduzida ao permitir trocas diretas entre os nós.

Soluções baseadas em P2P são especialmente úteis em contextos onde a descentralização é essencial, como sistemas de registro distribuído e blockchains.

### 8. Blockchain

A blockchain é uma aplicação avançada de tecnologias descentralizadas, combinando ledger distribuído e modelo P2P para armazenar dados de forma segura e transparente. Nessa estrutura, os dados são organizados em blocos conectados sequencialmente, criando um registro permanente e auditável.

Cada bloco contém:

- Dados: informações da transação ou evento.

- Hash: identificação única que garante a integridade do bloco.

- Hash do bloco anterior: conexão que mantém a ordem e a segurança da cadeia.

O funcionamento descentralizado e a verificação colaborativa dos nós tornam a blockchain uma solução confiável para diversas áreas, como finanças, saúde e logística. Além disso, o uso do modelo P2P permite maior escalabilidade e resiliência, eliminando intermediários e assegurando transparência.

Casos de uso práticos incluem transferências financeiras, rastreamento de produtos em cadeias de suprimentos e compartilhamento seguro de dados sensíveis, como registros médicos.

### 9. Solidity

Solidity é a linguagem de programação utilizada para criar contratos inteligentes na blockchain Ethereum. No projeto, a escolha de Solidity foi essencial para a implementação no ambiente HardHat. O paradigma da linguagem baseia-se na definição de contratos que estabelecem regras e permissões, além de possibilitar a manipulação de dados da aplicação, como os dados financeiros (utilizando a criptomoeda Ether). Solidity também permite a criação de funções e eventos, essenciais para a interatividade e o controle do fluxo de operações no sistema.

As funções em um contrato Solidity podem ser usadas para modularização do projeto, mas seu foco principal está na aplicação das funções públicas, que atuam como "endpoints" de uma API. A partir das funções públicas, são enviados dados e mensagens que manipulam a lógica de negócio do contrato, ou retornados valores e sinais, a partir de retornos ou eventos, para os usuários.

Os eventos servem para retornar sinais para os usuários, de acordo com acontecimentos dentro do contrato. Se tornam fundamentais para a publicação de informações necessárias aos clientes, trazendo transparência para a aplicação. Seu uso é também fundamental para notificar softwares externos, bem como interfaces gráficas ou API's externas, sobre alterações nos dados do contrato.

As funções precisam possuir regras de acesso, visando privacidade e segurança de dados. Para isso são inseridos modifiers no contrato Solidity. Os modifiers são simples validações de erro, que impedem a execução do programa de acordo com o não cumprimento de regras de acesso (permissões de usuário, valores mínimos, etc.).

## Metodologia

O “back-end” do produto foi majoritariamente escrito em cima de contratos inteligentes para uma blockchain Ethereum, que garante a proposta de completa descentralização do sistema. O ambiente de desenvolvimento HardHat foi utilizado para modelagem e testagem dos contratos.

### 1. Estruturação

O contrato foi modelado utilizando três estruturas principais: Account, Event e Bet. A estrutura Account armazena os valores da moeda virtual a ser apostada nos eventos, sendo esses valores guardados nas carteiras virtuais da aplicação. Para este protótipo, não foi implementado um câmbio entre a criptomoeda Ether e a moeda virtual da aplicação. Dessa forma, adotou-se uma taxa de câmbio de 1 para 1 (1 Ether = 1 moeda virtual da aplicação). Abaixo, estão os atributos da estrutura Account:

| **Estrutura** | **Atributo**      | **Descrição**                                                 |
|----------------|-------------------|-------------------------------------------------------------|
| Account        | isActive          | Confirma se a carteira foi registrada na aplicação.         |
|                | amount            | Montante da carteira do usuário.                           |

O Event guarda informações de um dado evento criado, que são:

| **Estrutura** | **Atributo**      | **Descrição**                                                 |
|----------------|-------------------|-------------------------------------------------------------|
| Event          | creator           | ID do criador do evento.                                    |
|                | eventType         | Descrição do evento.                                        |
|                | result            | Resultados possíveis (que os clientes irão apostar).        |
|                | isClosed          | Indica se a aposta foi encerrada ou não.                    |
|                | odds              | Odds respectivas a cada possibilidade.                     |
|                | amount            | Montante adquirido das apostas dos clientes.               |
|                | participants      | Todas as apostas feitas.                                   |

Os participantes são descritos pela estrutura Bet, com os valores:
| **Estrutura** | **Atributo**      | **Descrição**                                                 |
|----------------|-------------------|-------------------------------------------------------------|
| Bet            | gambler           | ID do apostador.                                            |
|                | bet               | Predição do usuário (qual possibilidade ele acredita ser a que ocorrerá). |
|                | betValue          | Valor a ser apostado.                                       |
|                | currentOdd        | Odd calculada no momento em que o usuário apostou.          |

### 2. Funções

O contrato desenvolvido, a ser descrito nesse tópico, visou atender os requisitos de gerenciamento da carteira dos clientes, usando para câmbio a criptomoeda Ether, do Ethereum. Outros requisitos a serem atendidos são a consulta, criação, manutenção e inscrição em apostas. Seguem as funções desenvolvidas:

| **Função**                    | **Descrição**                                                                                           |
|-------------------------------|---------------------------------------------------------------------------------------------------------|
| register()                    | Adiciona cliente à lista de usuários registrados no sistema e valida erros de possível registro duplicado. |
| deposit()                     | Interage com a carteira do usuário, transferindo um valor virtual para sua carteira na aplicação. Esse valor será convertido na moeda Ether para momentos de saque. |
| withdraw()                    | Interage com a carteira do usuário, convertendo o valor virtual a ser sacado em Ether.                   |
| getBalance()                  | Retorna o valor total armazenado na carteira do usuário.                                                |
| createEvent()                 | Cria um evento para que os demais usuários apostem. Recebe a descrição do evento e as odds para os possíveis resultados. |
| bet()                         | Realiza a inscrição de uma aposta em um dado evento, a partir do seu id, a predição do usuário e a quantia apostada na predição. |
| closeEventAndPayWinners()     | Função para encerrar uma aposta, inserir o resultado final e pagar os vencedores, recompensando o criador com a porcentagem restante do montante adquirido pela aposta. |
| changeOdd()                   | Acessa um evento pelo seu id e altera a odd, útil para o criador do evento realizar operações de odds dinâmicas em apostas em tempo real. |
| listCreatorEvents()           | Lista os eventos criados pelo remetente da mensagem.                                                   |
| listAllEvents()               | Lista todos os eventos cadastrados.                                                                    |

O sistema valida erros, criando permissões personalizadas para certas funções, a partir de “modifiers” Solidity. Funções que alteram um dado evento criado só podem ser acessadas pelo criador do evento. Praticamente todas as funções só podem ser acessadas por usuários registrados. Usuários só podem apostar em eventos ativos. Criadores de eventos não podem apostar nos próprios eventos, por fins de segurança.

### 3. Eventos 

Foram criados events Solidity - estes não se referem às instâncias da estrutura Event criada, mas sim aos events nativos do Solidity - para notificar aos usuários sobre atualizações na blockchain, reforçando a transparência e segurança do projeto, como foi requisitado à equipe. Seguem os events:

| **Evento**            | **Descrição**                                                                                           |
|-----------------------|---------------------------------------------------------------------------------------------------------|
| EventCreated          | Anuncia aos usuários a criação de novo evento para apostas.                                              |
| BetClosed             | Anuncia o encerramento de evento aos clientes.                                                           |
| UserRegistered        | Anuncia a inserção de novo usuário no sistema.                                                           |
| Deposit               | Anuncia um depósito na carteira.                                                                         |
| Withdrawal            | Anuncia saque na carteira.                                                                               |
| OddChange             | Anuncia alteração na odd de uma aposta específica, importante para a atualização dinâmica nas interfaces que apresentam os dados dos eventos. |

## Conclusão

Conclui-se que o sistema descrito, fundamentado em conceitos de consenso, armazenamento distribuído, modelo peer-to-peer e blockchain, apresenta características sólidas e funcionais para aplicações descentralizadas. O desenvolvimento exigiu a compreensão de técnicas relacionadas à segurança de dados, organização em redes distribuídas e tolerância a falhas, destacando a relevância de integrar diferentes abordagens para assegurar eficiência e confiabilidade.

Espera-se que esta implementação sirva como base para estudos futuros, promovendo o avanço contínuo de soluções tecnológicas descentralizadas e de sistemas distribuídos de alta eficiência.

## Referências

https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB

https://www.atlassian.com/br/microservices/microservices-architecture/distributed-architecture

TANENBAUM, Andrew. VAN STEEN, Maarten. Sistemas Distribuídos: princípios e paradigmas, 2ª edição. 2007.

DOOLEY, Kevin. Designing Large-Scale LANS.

https://www.databricks.com/br/glossary/acid-transactions

https://www.ibm.com/docs/pt-br/cics-tx/11.1?topic=processing-acid-properties-transactions

https://www.kaspersky.com.br/resource-center/definitions/spoofing

https://academy.bit2me.com/pt/que-es-falla-bizantina/

