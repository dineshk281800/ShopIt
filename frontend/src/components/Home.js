import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import toast from 'react-hot-toast'
import { useGetProductsQuery } from '../redux/api/productsApi'

import MetaData from './layout/MetaData'
import Loader from './layout/Loader'
import CustomPagination from './layout/CustomPagination'

import ProductItem from './product/ProductItem'
import Filters from './layout/Filters'
const Home = () => {

    let [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;
    const keyword = searchParams.get('keyword') || "";
    const min = searchParams.get('min');
    const max = searchParams.get('max');
    const category = searchParams.get('category');
    const ratings = searchParams.get('ratings');

    const params = { page, keyword }

    min !== null && (params.min = min);
    max !== null && (params.max = max);
    category !== null && (params.category = category);
    ratings !== null && (params.ratings = ratings);

    // console.log("=====================")
    // console.log(params)
    // console.log("=====================")

    const { data, isLoading, error, isError } = useGetProductsQuery(params);

    console.log("=====================")
    console.log(data)
    console.log("=====================")
    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message);
        }
    }, [isError]);
    const columnSize = keyword ? 4 : 3;
    // console.log(data, isLoading);
    if (isLoading) return <Loader />
    return (
        <>
            <MetaData title={"Buy Best Products Online"} />

            <div className="container">
                <div className="row">
                    {keyword &&
                        <div div className="col-6 col-md-3 mt-5">
                            <Filters />
                        </div>
                    }
                    <div className={keyword ? "col-6 col-md-9" : "col-6 col-md-12"}>
                        <h1 id="products_heading" className="text-secondary">
                            {keyword ? `${data?.products.length} products found with keyword: ${keyword}` : "Latest Products"}
                        </h1>

                        <section id="products" className="mt-5">
                            <div className="row">
                                {data?.products.map((product) => (
                                    <ProductItem product={product} columnSize={columnSize} />
                                ))}
                            </div>
                        </section>
                        <CustomPagination
                            resPerPage={data?.resPerPage}
                            filteredProductsCount={data?.filteredProductsCount}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home