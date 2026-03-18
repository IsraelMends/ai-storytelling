import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando seed do banco de dados...');

    // Limpar dados existentes (seguro para desenvolvimento)
    await prisma.storyEdge.deleteMany();
    await prisma.storyNode.deleteMany();
    await prisma.story.deleteMany();

    console.log('Dados antigos limpos.');

    // Criar história de exemplo
    const story = await prisma.story.create({
        data: {
            title: 'A Floresta dos Sussurros',
            description: 'Uma aventura misteriosa em uma floresta encantada',
            isPublic: true,
        },
    });

    console.log('História criada:', story.id);

    // Criar nó inicial
    const startNode = await prisma.storyNode.create({
        data: {
            storyId: story.id,
            title: 'O Despertar',
            text: 'Você desperta em uma clareira cercada por árvores antigas. Um sussurro ecoa ao vento. Dois caminhos se abrem diante de você: um segue a luz do sol filtrada pelas copas, outro adentra as sombras densas da floresta.',
            isStart: true,
            isEnding: false,
        },
    });

    console.log('Nó inicial criado:', startNode.id);

    // Criar dois ramos iniciais
    const lightNode = await prisma.storyNode.create({
        data: {
            storyId: story.id,
            title: 'Caminho da Luz',
            text: 'Você segue a luz. O ar fica mais quente e você avista uma cabana distante com fumaça saindo da chaminé. Alguém parece estar em casa.',
            isStart: false,
            isEnding: false,
        },
    });

    const shadowNode = await prisma.storyNode.create({
        data: {
            storyId: story.id,
            title: 'Caminho das Sombras',
            text: 'Você adentra as sombras. Os sussurros ficam mais claros e revelam segredos antigos sobre uma civilização perdida. As árvores parecem observar seus movimentos.',
            isStart: false,
            isEnding: false,
        },
    });

    console.log('Ramos criados:', lightNode.id, shadowNode.id);

    // Criar arestas
    await prisma.storyEdge.createMany({
        data: [
            {
                storyId: story.id,
                fromNodeId: startNode.id,
                toNodeId: lightNode.id,
                label: 'Seguir a luz',
            },
            {
                storyId: story.id,
                fromNodeId: startNode.id,
                toNodeId: shadowNode.id,
                label: 'Explorar as sombras',
            },
        ],
    });

    console.log('Arestas criadas.');
    console.log('✅ Seed completado! Story ID:', story.id);
    console.log('Acesse: http://localhost:3000/story/' + story.id);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });