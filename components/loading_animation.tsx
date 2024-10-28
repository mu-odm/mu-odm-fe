import Lottie from 'lottie-react';
import loading_animation from '@/public/animations/loading_animation.json';

export default function LoadingAnimation() {
    return (
        <div className='w-full h-[40rem] flex flex-col items-center justify-center'>
            <Lottie 
                animationData={loading_animation}
                loop={true}
                autoplay={true}
                className='w-full h-96'
            />
        </div>
    )
}