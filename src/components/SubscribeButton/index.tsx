import { useSession, signIn } from 'next-auth/react'
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe.js';
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession();

    console.log("Subscribebutton" + JSON.stringify(session, null, 2))

    async function handleSubscribe() {
        if(!session) {
            signIn('github')
            return;  
        }

        //Checkout session
        try {
            const response = await api.post('/subscribe')

            const { sessionId } = response.data;

            const stripe = await getStripeJs()
            await stripe.redirectToCheckout({ sessionId })
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <button
        type="button"
        className={styles.SubscribeButton}
        onClick={handleSubscribe}
        >
            Subscribe Now
        </button>
    )
}