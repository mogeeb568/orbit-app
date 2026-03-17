export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { paymentId } = req.body;

        if (!paymentId) {
            return res.status(400).json({ error: 'Payment ID required' });
        }

        console.log('Completing payment:', paymentId);

        return res.status(200).json({
            success: true,
            message: 'Payment completed successfully',
            paymentId: paymentId
        });

    } catch (error) {
        console.error('Error completing payment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}