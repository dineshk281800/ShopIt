import React from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../layout/MetaData'

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
    return (
        <>
            {/* <MetaData title={"Checkout Shipping Info"} /> */}
            <div className="checkout-progress d-flex justify-content-center mt-5">
                {shipping ? (
                    // { Shipping (Active) }
                    <Link to="/shipping" className="float-right">
                        <div className="triangle2-active"></div>
                        <div className="step active-step">Shipping</div>
                        <div className="triangle-active"></div>
                    </Link>
                ) : (
                    // { Shipping (Inactive) }
                    <Link to="#!" className="float-right" disabled>
                        <div className="triangle2-incomplete"></div>
                        <div className="step incomplete">Shipping</div>
                        <div className="triangle-incomplete"></div>
                    </Link>
                )}

                {confirmOrder ? (
                    // { Confirm Order (Active)}
                    <Link to="/confirm_order" className="float-right">
                        <div className="triangle2-active"></div>
                        <div className="step active-step">Confirm Order</div>
                        <div className="triangle-active"></div>
                    </Link>
                )
                    : (
                        // {Confirm Order (Inactive)}
                        <Link to="#!" className="float-right" disabled>
                            <div className="triangle2-incomplete"></div>
                            <div className="step incomplete">Confirm Order</div>
                            <div className="triangle-incomplete"></div>
                        </Link>
                    )
                }

                {payment ? (
                    // {Payment (Active)}
                    <Link to="/payment_method" className="float-right">
                        <div className="triangle2-active"></div>
                        <div className="step active-step">Payment</div>
                        <div className="triangle-active"></div>
                    </Link>
                ) : (
                    // {Payment (Inactive)}
                    <Link to="#!" className="float-right" disabled>
                        <div className="triangle2-incomplete"></div>
                        <div className="step incomplete">Payment</div>
                        <div className="triangle-incomplete"></div>
                    </Link>
                )}

            </div >
        </>
    )
}

export default CheckoutSteps