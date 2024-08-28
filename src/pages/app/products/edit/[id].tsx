import { useToast } from "@chakra-ui/react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { Button, Divider, NumberInput, Select, SelectItem, TextInput, Textarea } from "@tremor/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useIsOnline } from "react-use-is-online";
import useSWR from "swr";
import { fetcherSWR } from "../../../../../components/helpers/fetcherSWR";

const NewClient: NextPage = () => {

    const { isOnline, isOffline, error } = useIsOnline();
    const router = useRouter();
    const { id } = router.query;

    const toast = useToast();
    const { data: productData, error: productError, isLoading: productLoading, mutate: productRefresh } = useSWR(`${process.env.NEXT_PUBLIC_SERVER_URL}/products/${id}`, fetcherSWR);

    const [loaderProducto, setLoaderProducto] = useState(false);
    const [newProductData, setNewProductData] = useState({
        id: 0,
        name: "",
        description: "",
        category: "",
        price: 0,
        stock: 0,
    });

    useEffect(() => {
        if (productData) {
            setNewProductData({
                id: productData.id,
                name: productData.name || '',
                description: productData.description || '',
                category: productData.category || '',
                price: productData.price || 0,
                stock: productData.stock || 0,
            });
        }
    }, [productData]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoaderProducto(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Incluir cookies de sesión
                body: JSON.stringify(newProductData)
            });

            if (res.ok) {
                productRefresh();
                toast({
                    title: 'Producto Actualizado!',
                    status: 'success',
                    position: 'bottom',
                    duration: 4000,
                });
                router.push('/app/products');
            } else {
                console.error('Failed to update product');
            }
        } catch (error) {
            console.error('Failed to update product ' + error);
                toast({
                    title: 'Hubo un error...',
                    status: 'error',
                    position: 'bottom',
                    duration: 4000,
                });
        }


        setLoaderProducto(false);
    };

    const isLoading = productLoading;


    if (isOffline) return (
        <div className='full-screen-div italic text-gray-600'>
            <h4>No Hay Conexión a Internet...</h4>
        </div>
    )

    if (isLoading) return (
        <div className='full-screen-div'>
            <div role="status">
                <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin fill-gray-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )

    return (
        <>
            <div className="px-4 py-3 ">
                <h3 className="text-tremor-title font-semibold text-tremor-content-strong">
                    Editar Producto
                </h3>
                <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                    Para actualizar un producto, rellena el edita el formulario
                </p>
                <form className="mt-6">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="name"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Nombre del Producto
                                <span className="mx-1 text-red-500">*</span>
                            </label>
                            <TextInput
                                type="text"
                                id="name"
                                name="name"
                                autoComplete="name"
                                placeholder="Nombre"
                                className="mt-2 py-1"
                                value={newProductData.name || ""}
                                onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="category"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Categoria
                                <span className="mx-1 text-red-500">*</span>
                            </label>
                            <Select 
                                id="category" 
                                name="category" 
                                className="mt-2 py-1"
                                placeholder="Categorias"
                                value={newProductData.category || ""}
                                onValueChange={(value: string) => setNewProductData({ ...newProductData, category: value })}
                                required
                            >
                                <SelectItem value={"Electronico"}>Electronico</SelectItem>
                                <SelectItem value={"Audio"}>Audio</SelectItem>
                                <SelectItem value={"Accesorios"}>Accesorios</SelectItem>
                                <SelectItem value={"Alimentos"}>Alimentos</SelectItem>
                                <SelectItem value={"Adorno"}>Adorno</SelectItem>
                            </Select>
                        </div>
                        <div className="col-span-full">
                            <label
                                htmlFor="description"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Descripcion
                                <span className="mx-1 text-red-500">*</span>
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Descripcion"
                                value={newProductData.description || ""}
                                onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        
                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="price"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Precio
                                <span className="mx-1 text-red-500">*</span>
                            </label>
                            <NumberInput
                                id="price"
                                name="price"
                                value={newProductData.price}
                                onValueChange={(newValue) => setNewProductData({ ...newProductData, price: newValue })}
                                enableStepper={false} icon={CurrencyDollarIcon}
                                placeholder="Precio..."
                                className="mt-2 py-1"
                                required />
                        </div>
                        
                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="stock"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Cantidad
                                <span className="mx-1 text-red-500">*</span>
                            </label>
                            <NumberInput
                                id="stock"
                                name="stock"
                                value={newProductData.stock}
                                onValueChange={(newValue) => setNewProductData({ ...newProductData, stock: newValue })}
                                enableStepper={true}
                                placeholder="Cantidad..."
                                className="mt-2 py-1"
                                required />
                        </div>


                    </div>

                    <Divider />

                    <div className="flex items-center justify-end space-x-4">
                        <Link href={'/app/products'}>
                            <button
                                type="button"
                                className="whitespace-nowrap rounded-tremor-small px-4 py-2.5 text-tremor-default font-medium text-tremor-content-strong"
                            >
                                Cancelar
                            </button>
                        </Link>

                        <Button
                            className="bg-gray-800 border-gray-800 hover:bg-gray-600 px-10 hover:border-gray-800"
                            onClick={handleSubmit}
                            loading={loaderProducto}
                            loadingText={"Creando..."}
                        >
                            Actualizar Producto
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}


export default NewClient;