
import { Button, Card, List, ListItem } from "@tremor/react";
import { NextPage } from "next";
import { BanknotesIcon, ClockIcon, CubeIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userAgent } from "next/server";
import useSWR from 'swr';
import { fetcherSWR } from "../../../components/helpers/fetcherSWR";
import { ProductItem } from "../../../components/helpers/interfaces";
import { productList } from "../../../components/helpers/fakeData";



const Dashboard: NextPage = () => {

    //const { data: products, error: errorProducts, isLoading: loadingProducts, mutate: mutateProducts } = useSWR<ProductItem[]>(`${process.env.NEXT_PUBLIC_API_URL}/products`, fetcherSWR);
    

    const [userLogged, setUserLogged] = useState("John");

    //const isLoading = loadingProducts;
    //const isError = errorProducts;



    // if (isError) return (
    //     <div className='full-screen-div'>
    //         <div className="flex flex-col">
    //             <h4>Hubo un Error...</h4>
    //             <Card
    //                 className="mt-6"
    //                 decoration="top"
    //                 decorationColor="red">
    //                 <pre className="px-4">
    //                     <code className="break-words text-xs">
    //                         {isError.message || JSON.stringify(isError, null, 2)}
    //                     </code>
    //                 </pre>
    //             </Card>
    //         </div>

    //     </div>
    // )

    // if (isLoading) return (
    //     <div className='full-screen-div'>
    //         <div role="status">
    //             <svg aria-hidden="true" className="inline w-12 h-12 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
    //                 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    //             </svg>
    //             <span className="sr-only">Loading...</span>
    //         </div>
    //     </div>
    // )


    return (
        <>
            <div className="px-4 py-3">
                <div>
                    <h1 className="text-2xl font-bold text-tremor-content-strong">Saludos {userLogged}!</h1>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                        A continuación, se muestran algunas métricas útiles para el análisis de la empresa.
                    </p>
                </div>
            </div>

            {/* KPI's */}
            <div className="grid grid-cols-4 gap-8 px-4 pt-4">
                <Card className="mx-auto">
                    <p className="text-tremor-default text-tremor-content">Productos Registrados</p>
                    <p className="text-3xl text-tremor-content-strong font-semibold">{productList.length}</p>
                </Card>
                <Card className="mx-auto">
                    <p className="text-tremor-default text-tremor-content">KPI #2</p>
                    <p className="text-3xl text-tremor-content-strong font-semibold">0</p>
                </Card>
                <Card className="mx-auto">
                    <p className="text-tremor-default text-tremor-content">KPI #3</p>
                    <p className="text-3xl text-tremor-content-strong font-semibold">0</p>
                </Card>
                <Card className="mx-auto">
                    <p className="text-tremor-default text-tremor-content">KPI #4</p>
                    <p className="text-3xl text-tremor-content-strong font-semibold">0</p>
                </Card>

            </div>

            {/* BOTONES QUICK */}
            <div className="px-4 pt-8">

                <div className="grid grid-cols-3 gap-8">
                    <Link href={'/app/billing/new-sell'}>
                        <Card className="mx-auto bg-gray-800 hover:scale-90 transition duration-200 ease-in-out">
                            <div className="flex justify-center">
                                <Button className="text-white hover:text-white" variant="light" icon={CubeIcon}>Nuevo Producto</Button>
                            </div>
                        </Card>
                    </Link>
                    <Link href={'/app/clients/new-client'}>
                        <Card className="mx-auto bg-gray-800 hover:scale-90 transition duration-200 ease-in-out">
                            <div className="flex justify-center">
                                <Button className="text-white hover:text-white" variant="light" icon={ClockIcon}>Quick Button #2</Button>
                            </div>
                        </Card>
                    </Link>
                    <Link href={'/app/clients/new-client'}>
                        <Card className="mx-auto bg-gray-800 hover:scale-90 transition duration-200 ease-in-out">
                            <div className="flex justify-center">
                                <Button className="text-white hover:text-white" variant="light" icon={ClockIcon}>Quick Button #3</Button>
                            </div>
                        </Card>
                    </Link>
                </div>
                
                    
                


            </div>

            {/* GRAFICOS*/}
            <div className="grid grid-cols-1 px-4 pt-8">
                <Card className="mx-auto">
                    <p className=" text-tremor-content-strong font-semibold">GRAFICOS</p>
                    <div className="mx-auto max-w-md">
                        {/* <List>
                            {
                                subscriptions.map((sub: Subscription) => (
                                    <ListItem key={sub.id}>
                                        <span>{sub.clientOwner.name}</span>
                                        <span>RD$ {sub.amount}</span>
                                    </ListItem>
                                ))
                            }
                        </List> */}
                    </div>

                </Card>
            </div>




        </>
    )
}

export default Dashboard;