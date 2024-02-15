import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import StarRatings from 'react-star-ratings'
import { useParams } from 'react-router-dom'

import Loader from '../layout/Loader'


const ProductDetails = () => {
    const { id } = useParams();

    const [productData, setProductData] = useState([]);
    const [images, setImages] = useState([]);
    const [activeImage, setActiveImage] = useState('')

    const productFetchData = useCallback(async () => {
        try {
            const result = await fetch(`http://localhost:8000/api/v1/products/${id}`)
            if (!result.ok) {
                throw new Error(`HTTP error! Status: ${result.status}`);
            }
            const data = await result.json()
            console.log(data)
            console.log(data.product.images)
            setActiveImage(data.product.images[0] ? data.product.images[0].url : "./images//default_product.png")
            setProductData(data.product)
            setImages(data.product.images)
        } catch (error) {
            toast.error(error.message);
        }
    }, [id])
    useEffect(() => {
        productFetchData()
        // console.log(productData)
        console.log(productData.images)
        // setActiveImage(productData.images[0] ? productData.images[0].url : "./images//default_product.png")
    }, []);

    // if (isLoading) return <Loader />
    return (
        <div className="row d-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
                <div className="p-3">
                    <img
                        className="d-block w-100"
                        src={activeImage}
                        alt={productData.name}
                        width="340"
                        height="390"
                    />
                </div>
                <div className="row justify-content-start mt-5">
                    {
                        images.map((image) => (
                            <div className="col-2 ms-4 mt-2">
                                <a role="button">
                                    <img
                                        className={`d-block border rounded p-3 cursor-pointer ${image.url === activeImage ? "border-warning" : ""}`}
                                        height="100"
                                        width="100"
                                        src={image.url}
                                        alt={image.url}
                                        onClick={(e) => setActiveImage(image.url)}
                                    />
                                </a>
                            </div>
                        ))
                    }

                </div>
            </div>

            <div className="col-12 col-lg-5 mt-5">
                <h3>{productData.name}</h3>
                <p id="product_id">Product # {productData._id}</p>

                <hr />

                <div className="d-flex">
                    <StarRatings
                        rating={productData.ratings}
                        starRatedColor="#ffb829"
                        // changeRating={this.changeRating}
                        numberOfStars={5}
                        name='rating'
                        starDimension='24px'
                        starSpacing='1px'
                    />
                    <span id="no-of-reviews" className="pt-1 ps-2"> ({productData.numOfReviews} Reviews) </span>
                </div>
                <hr />

                <p id="product_price">${productData.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus">-</span>
                    <input
                        type="number"
                        className="form-control count d-inline"
                        value="1"
                        readonly
                    />
                    <span className="btn btn-primary plus">+</span>
                </div>
                <button
                    type="button"
                    id="cart_btn"
                    className="btn btn-primary d-inline ms-4"
                    disabled=""
                >
                    Add to Cart
                </button>

                <hr />

                <p>
                    Status: <span id="stock_status" className={productData.stock > 0 ? "greenColor" : "redColor"}>
                        {productData.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                </p>

                <hr />

                <h4 className="mt-2">Description:</h4>
                <p>
                    {productData.description}
                </p>
                <hr />
                <p id="product_seller mb-3">Sold by: <strong>{productData.seller}</strong></p>

                <div className="alert alert-danger my-5" type="alert">
                    Login to post your review.
                </div>
            </div>
        </div>
    )
}

export default ProductDetails