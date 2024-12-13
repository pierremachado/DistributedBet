# DistributedBet

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

### 3. Propriedades ACID

Em um sistema distribuído, como o de apostas, as transações desempenham um papel essencial na manutenção da integridade dos dados. De acordo com a empresa de dados Databricks, uma transação em um banco de dados é "qualquer operação tratada como uma unidade de trabalho. As transações são totalmente executadas ou não executadas, mantendo o sistema de armazenamento em um estado consistente" (s.d.). Essas características eliminam a possibilidade de estados intermediários. Em um sistema de apostas distribuídas, por exemplo, se um usuário decide apostar uma quantia, a operação será concluída apenas se houver saldo suficiente. Não há espaço para um estado intermediário em que a aposta simultaneamente exista e não exista.

Neste caso, conforme aponta Databricks (s.d.), um banco de dados distribuído deve implementar as seguintes propriedades:

- Atomicidade: as etapas de uma transação, como no caso de uma aposta debitar o saldo atual e inserir o endereço de identificação do usuário na lista de apostadores, são tratadas como uma única operação indivisível. Todas as instruções devem ser concluídas com sucesso. Caso contrário, nenhuma delas será aplicada, garantindo a integridade dos dados e evitando perdas ou corrupções.
- Consistência: segundo a IBM, os dados devem estar em “um estado consistente quando uma transação começa e quando ela termina” (2022). Por exemplo, ao depositar uma quantia de dinheiro, o sistema deve garantir que o saldo do apostador seja incrementado corretamente, sem gerar discrepâncias nos dados.
- Isolamento: mesmo que duas ou mais transações ocorram simultaneamente, seus estados intermediários devem permanecer invisíveis umas às outras. Assim, uma transação em andamento não deve ser interferida ou impactada por outra.
- Durabilidade: após a conclusão de uma transação, as alterações nos dados devem ser permanentes, mesmo em caso de falhas catastróficas. Por exemplo, uma aposta criada com sucesso não pode ser revertida posteriormente devido a uma falha inesperada no sistema.

Essas propriedades são, portanto, fundamentais para a construção de um sistema robusto. Contudo, a natureza distribuída dos sistemas frequentemente apresenta desafios. Para superá-los, é essencial implementar protocolos que assegurem uma comunicação eficiente e consistente entre os "nós" do sistema.


### 4. Teorema CAP

### 5. Consenso

### 6. Ledger distribuído

### 7. Blockchain

## Metodologia

## Resultados e discussões

## Conclusão

## Referências

https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB

https://www.atlassian.com/br/microservices/microservices-architecture/distributed-architecture

TANENBAUM, Andrew. VAN STEEN, Maarten. Sistemas Distribuídos: princípios e paradigmas, 2ª edição. 2007.

DOOLEY, Kevin. Designing Large-Scale LANS.

https://www.databricks.com/br/glossary/acid-transactions

https://www.ibm.com/docs/pt-br/cics-tx/11.1?topic=processing-acid-properties-transactions

