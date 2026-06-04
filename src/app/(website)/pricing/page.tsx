
import TestimonialGrid from '@/features/Home/component/Testimonials'
import Pricing from '@/features/pricing/component/Pricing'
import React from 'react'

export default function page() {
    return (
        <div>
            <Pricing />
            <div className='mb-4'>
                <TestimonialGrid />
            </div>
        </div>
    )
}
