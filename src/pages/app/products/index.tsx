import { NextPage } from "next";
import { Button, Card, Dialog, DialogPanel, MultiSelect, MultiSelectItem, Switch, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";
import { fetcherSWR } from "../../../../components/helpers/fetcherSWR";
import { ProductItem } from "../../../../components/helpers/interfaces";
import { productList } from "../../../../components/helpers/fakeData";
import { formatCurrency, useLoaded } from "../../../../components/helpers/funtions";

const ClientsIndex: NextPage = () => {

    const [selectedId, setSelectedId] = useState(0);

    const router = useRouter();
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    const changeSelectedId = (id: number) => {
        setIsOpen(true)
        setSelectedId(id);
    }

    //const { data: products, error: errorProducts, isLoading: loadingProducts, mutate: mutateProducts } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/products`, fetcherSWR);
    const products = productList;
    const loadingProducts = false;


    const isProductsSelected = (product: ProductItem) =>
        selectedProducts.includes(product.name) || selectedProducts.length === 0;

    const isLoading = loadingProducts;

    // PAGINACION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products?.slice(indexOfFirstItem, indexOfLastItem);

    var totalPages = 0;

    if (selectedProducts.length === 0) {
        totalPages = Math.ceil((products?.length ?? 0) / itemsPerPage);
    } else {
        totalPages = Math.ceil((selectedProducts?.length ?? 0) / itemsPerPage);
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // ELIMINAR PRODUCTO

    const handleDeleteProduct = async (idProduct: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/products/${idProduct}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const json = await res.json();
            console.log(json);

            toast({
                title: 'Producto Eliminado!',
                description: "Se elimino el producto correctamente.",
                status: 'success',
                position: 'bottom',
                duration: 4000,
            });

        } catch (error) {
            console.error(error);
            toast({
                title: 'Hubo un error!',
                description: "Intentalo mas tarde...",
                status: 'error',
                position: 'bottom',
                duration: 4000,
            });
        }
        setIsOpen(false);
    };

    // END

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

    if (useLoaded()) {
        return (
            <div className="px-4 py-3">
                <div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
                    <div>
                        <h1 className="text-2xl font-bold text-tremor-content-strong">Productos</h1>
                        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                            Listado general de todos los productos registrados.
                        </p>
                    </div>
                    <Link href={'/app/products/new-product'}>
                        <button
                            type="button"
                            className="mt-4 w-full whitespace-nowrap rounded-tremor-small bg-gray-800 px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-gray-600 sm:mt-0 sm:w-fit"
                        >
                            Nuevo Producto
                        </button>
                    </Link>

                </div>
                <div>
                    <MultiSelect
                        placeholder="Buscar..."
                        className="mt-4 w-full"
                        onValueChange={setSelectedProducts}
                    >

                        {products.map((product: ProductItem) => (
                            <MultiSelectItem key={product.id} value={product.name}>
                                {product.name}
                            </MultiSelectItem>
                        ))}

                    </MultiSelect>
                </div>
                <Card className="mt-8 p-1">
                    <Table>
                        <TableHead>
                            <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    ID
                                </TableHeaderCell>
                                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    Producto
                                </TableHeaderCell>
                                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    Descripcion
                                </TableHeaderCell>
                                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    Categoria
                                </TableHeaderCell>
                                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    Precio
                                </TableHeaderCell>
                                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    Cantidad
                                </TableHeaderCell>
                                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    Acciones
                                </TableHeaderCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentProducts?.length > 0 ? (
                                currentProducts?.filter((product: ProductItem) => isProductsSelected(product)).map((product: ProductItem) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                            #{product.id}
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell className="font-medium text-tremor-content-strong">
                                            {formatCurrency(product.price)}
                                        </TableCell>
                                        <TableCell>{product.quantity}</TableCell>

                                        <TableCell>
                                            <Link href={`/app/clients/${product.id}`}>
                                                <Button variant="light" className="mx-3" icon={EyeIcon}></Button>
                                            </Link>
                                            <Link href={`/app/clients/edit/${product.id}`}>
                                                <Button variant="light" className="mx-3 text-gray-800" icon={PencilIcon}></Button>
                                            </Link>
                                            <Button className="mx-3" variant="light" onClick={() => changeSelectedId(product.id)} color="red" icon={TrashIcon}></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-tremor-content-muted dark:text-dark-tremor-content-muted">
                                        No hay Productos Registrados
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex justify-between items-center mt-6 mb-2 px-3">
                        <p className="text-tremor-default tabular-nums text-tremor-content mx-2">
                            Página{' '}
                            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {`${currentPage}`}</span>{' '}
                            de
                            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {' '}
                                {totalPages}
                            </span>
                        </p>

                        <div className="inline-flex items-center rounded-tremor-full shadow-tremor-input ring-1 ring-inset ring-tremor-ring">
                            <button
                                className="py-2 px-3"
                                onClick={handlePreviousPage} disabled={currentPage === 1}
                            >
                                <span className="sr-only">Previous</span>
                                <ArrowLeftIcon
                                    className="h-5 w-5 text-tremor-content-emphasis group-hover:text-tremor-content-strong dark:text-dark-tremor-content-emphasis group-hover:dark:text-dark-tremor-content-strong"
                                    aria-hidden={true}
                                />
                            </button>
                            <span
                                className="h-5 border-r border-tremor-border dark:border-dark-tremor-border"
                                aria-hidden={true}
                            />
                            <button
                                className="py-2 px-3"
                                onClick={handleNextPage} disabled={currentPage === totalPages}
                            >
                                <span className="sr-only">Next</span>
                                <ArrowRightIcon
                                    className="h-5 w-5 text-tremor-content-emphasis group-hover:text-tremor-content-strong dark:text-dark-tremor-content-emphasis group-hover:dark:text-dark-tremor-content-strong"
                                    aria-hidden={true}
                                />
                            </button>
                        </div>
                    </div>



                </Card>

                {/* CONFIRMACION DE ELIMINAR PRODUCTO */}

                <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
                    <DialogPanel>
                        <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Confirmación de Borrado</h3>
                        <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            Si deseas borrar este producto permanentemente, selecciona "Eliminar".
                        </p>
                        <div className="mt-8 flex items-center justify-end space-x-2">
                            <Button variant="light" className="px-4 text-black" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </Button>
                            <Button className="hover:bg-gray-600 px-8 bg-gray-800 border-gray-800" onClick={() => handleDeleteProduct(selectedId)}>
                                Eliminar
                            </Button>
                        </div>

                    </DialogPanel>
                </Dialog>
            </div>
        )
    }


}


export default ClientsIndex;