import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe('pk_test_51QbrRtQwHPZeYtmdPGjCec7FU7L9bL6QznnklpnzYXkqbRkbHYHOaok1MMfMQy2i2fG6vGSDRXl37TptQAxUCVgp004duyqL6H');

export const bookTour = async tourId => {
    try {
        // Get checkout session from API
        const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
        // console.log(session);
    
        // Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch (error) {
        console.log(err);
        showAlert('error', err);
    }

}