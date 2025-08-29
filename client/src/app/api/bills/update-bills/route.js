import axios from "axios";

export async function PUT(request) {
    const { billId, userId, status, amount } = await request.json();
    console.log('hit in the next api');
    // console.log('Received data for updating payment:', { billId, userId, status, amount });

    try {
        const apiUrl =  process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.put(
            `${apiUrl}/api/payments/update`,
            { billId, userId, status, amount },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Payment update error:', error);
        return new Response(JSON.stringify({ error: 'Failed to update payment' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
