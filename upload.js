export default async function handler(req, res) {
    // Segurança: Aceitar apenas requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido.' });
    }

    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    try {
        // A chave da API fica segura no servidor, configurada no painel (Environment Variables)
        const apiKey = process.env.IMGBB_API_KEY; 
        
        const formData = new URLSearchParams();
        formData.append('key', apiKey);
        formData.append('image', image);

        // O Servidor faz a comunicação com o ImgBB
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Retorna apenas a URL final pública e segura para o front-end
            return res.status(200).json({ url: data.data.url });
        } else {
            return res.status(500).json({ error: 'Falha ao processar o upload no provedor.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
}