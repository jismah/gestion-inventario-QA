
import { Button, Card, Dialog, DialogPanel, List, ListItem, MultiSelect, MultiSelectItem, NumberInput, Select, SelectItem, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextInput } from "@tremor/react";
import { NextPage } from "next";
import { BanknotesIcon, BellAlertIcon, ClockIcon, CubeIcon, CurrencyDollarIcon, EyeIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userAgent } from "next/server";
import useSWR from 'swr';
import { fetcherSWR } from "../../../components/helpers/fetcherSWR";
import { ProductItem, StockMovement } from "../../../components/helpers/interfaces";
import { format } from 'date-fns';
import { filterLowStockProducts } from "../../../components/helpers/funtions";
import { useToast } from "@chakra-ui/react";



const Dashboard: NextPage = () => {

    const { data: products, error: errorProducts, isLoading: loadingProducts, mutate: mutateProducts } = useSWR<ProductItem[]>(`${process.env.NEXT_PUBLIC_SERVER_URL}/products`, fetcherSWR);
    const { data: StockMovement, error: errorStockMovements, isLoading: loadingStockMovements, mutate: mutateStockMovements } = useSWR<StockMovement[]>(`${process.env.NEXT_PUBLIC_SERVER_URL}/stock-movements`, fetcherSWR);

    const [selectedMovements, setSelectedMovements] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loaderNewMovement, setLoaderNewMovement] = useState(false);
    const toast = useToast();

    const [TypeMovement, setTypeMovement] = useState("");
    const [idProductMovement, setIdProductMovement] = useState("");
    const [quantityMovement, setQuantityMovement] = useState(0);

    var disableMovementBtn = true;


    if (!(TypeMovement === "") && !(idProductMovement === "") && !(quantityMovement === 0)) {
        disableMovementBtn = false;
    }

    const isMovementsSelected = (movement: StockMovement) =>
        selectedMovements.includes(movement.Product.name) || selectedMovements.length === 0;

    // PAGINACION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMovements =
        StockMovement?.slice(indexOfFirstItem, indexOfLastItem) || [];

    var totalPages = 0;

    if (selectedMovements.length === 0) {
        totalPages = Math.ceil((StockMovement?.length ?? 0) / itemsPerPage);
    } else {
        totalPages = Math.ceil((selectedMovements?.length ?? 0) / itemsPerPage);
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

    const createNewMovement = async (e: React.FormEvent) => {
        setLoaderNewMovement(true);
        e.preventDefault();

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/stock-movements/update-stock/${idProductMovement}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        quantity: quantityMovement,
                        type: TypeMovement,
                    }),
                }
            );
            const json = await res.json();
            console.log(json);

            if (res.status === 200) {
                setIdProductMovement("");
                setQuantityMovement(0);
                setTypeMovement("");

                setIsOpen(false);

                toast({
                    title: "Movimiento de Producto Creado!",
                    status: "success",
                    position: "bottom",
                    duration: 4000,
                });

                mutateProducts();
                mutateStockMovements();

                // Revisar el estado del stock del producto
                const productRes = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/${idProductMovement}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );
                const productData = await productRes.json();

                if (productData.stock <= productData.min_stock) {
                    toast({
                        title: "Advertencia!",
                        description: `El producto ${productData.name} tiene un stock bajo.`,
                        status: "warning",
                        position: "bottom",
                        duration: 4000,
                    });
                }


            } else {
                toast({
                    title: json.error || "Error al crear movimiento",
                    description: res.statusText,
                    status: "error",
                    position: "bottom",
                    duration: 4000,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Hubo un error!",
                description: "Inténtalo más tarde...",
                status: "error",
                position: "bottom",
                duration: 4000,
            });
        }
        setLoaderNewMovement(false);
    }

    const isLoading = loadingProducts || loadingStockMovements;
    const isError = errorProducts || errorStockMovements;



    if (isError) return (
        <div className='full-screen-div'>
            <div className="flex flex-col">
                <h4>Hubo un Error...</h4>
                <Card
                    className="mt-6"
                    decoration="top"
                    decorationColor="red">
                    <pre className="px-4">
                        <code className="break-words text-xs">
                            {isError.message || JSON.stringify(isError, null, 2)}
                        </code>
                    </pre>
                </Card>
            </div>

        </div>
    )

    if (isLoading) return (
        <div className='full-screen-div'>
            <div role="status">
                <svg aria-hidden="true" className="inline w-12 h-12 text-gray-200 animate-spin fill-gray-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )


    return (
        <>
            <div className="px-4 py-3">
                <div>
                    <h1 className="text-2xl font-bold text-tremor-content-strong">Bienvenido a SalesX!</h1>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                        A continuación, se muestran algunas métricas útiles para el análisis de la empresa.
                    </p>
                </div>
            </div>

            {/* KPI's */}
            <div className="md:grid md:grid-cols-2 md:gap-8 px-4 pt-4 sm:grid sm:grid-cols-2 sm:gap-4">
                <Card className="mx-auto">
                    <p className="text-tremor-default text-tremor-content">Productos Registrados</p>
                    <p className="text-3xl text-tremor-content-strong font-semibold">{products?.length}</p>
                </Card>
                <Card className="mx-auto">
                    <p className="text-tremor-default text-tremor-content">Movimientos Registrados</p>
                    <p className="text-3xl text-tremor-content-strong font-semibold">{StockMovement?.length}</p>
                </Card>



            </div>

            {/* BOTONES QUICK */}
            <div className="px-4 pt-8">

                <div className="grid grid-cols-3 gap-8">
                    <Link href={'/app/products/new-product'}>
                        <Card className="mx-auto bg-gray-800 hover:scale-90 transition duration-200 ease-in-out">
                            <div className="flex justify-center">
                                <Button className="text-white hover:text-white" variant="light" icon={CubeIcon}>Nuevo Producto</Button>
                            </div>
                        </Card>
                    </Link>
                    <Link href={'/app/products'}>
                        <Card className="mx-auto bg-gray-800 hover:scale-90 transition duration-200 ease-in-out">
                            <div className="flex justify-center">
                                <Button className="text-white hover:text-white" variant="light" icon={EyeIcon}>Ver Productos</Button>
                            </div>
                        </Card>
                    </Link>

                    <Card className="mx-auto bg-gray-800 hover:scale-90 transition duration-200 ease-in-out cursor-pointer" onClick={() => setIsOpen(true)}>
                        <div className="flex justify-center">
                            <Button className="text-white hover:text-white" variant="light" icon={BellAlertIcon}>Registrar Entrada/Salida</Button>
                        </div>
                    </Card>

                </div>

            </div>

            {/* HISTORIAL DE MOVIMIENTOS*/}
            <div className="grid grid-cols-1 px-4 pt-8 pb-4">
                <Card className="mx-auto">
                    <p className=" text-tremor-content-strong font-semibold">Historial de Movimientos</p>
                    <div>
                        <MultiSelect
                            placeholder="Buscar..."
                            className="mt-4 w-full"
                            onValueChange={setSelectedMovements}
                        >
                            {StockMovement?.map((movement: StockMovement) => (
                                <MultiSelectItem key={movement.id} value={movement.Product.name}>
                                    {movement.id} | {movement.Product.name} | {movement.type}
                                </MultiSelectItem>
                            ))}
                        </MultiSelect>
                    </div>
                    <div className="">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>
                                        Producto
                                    </TableHeaderCell>
                                    <TableHeaderCell>Cantidad Modificada</TableHeaderCell>
                                    <TableHeaderCell>Tipo de Movimiento</TableHeaderCell>
                                    <TableHeaderCell>Usuario</TableHeaderCell>
                                    <TableHeaderCell>Fecha</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentMovements?.length > 0 ? (
                                    currentMovements
                                        ?.filter((movement: StockMovement) => isMovementsSelected(movement))
                                        .map((movement: StockMovement) => (
                                            <TableRow key={movement.id}>
                                                <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                                    #{movement.id}
                                                </TableCell>
                                                <TableCell>{movement.Product.name}</TableCell>
                                                <TableCell>{movement.quantity}</TableCell>
                                                <TableCell>{movement.type}</TableCell>

                                                <TableCell>{movement.User.username}</TableCell>
                                                <TableCell>{format(movement.createdAt, 'dd/MM/yyyy HH:mm:ss')}</TableCell>

                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-tremor-content-muted dark:text-dark-tremor-content-muted"
                                        >
                                            No hay Productos Registrados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                </Card>
            </div>


            {/* REGISTRO DE ENTRADA/SALIDA */}

            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
                <DialogPanel>
                    <h3 className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong mb-3">
                        Registro de Entrada/Salida de Producto
                    </h3>

                    <div className="col-span-full">
                        <label
                            htmlFor="product"
                            className="text-tremor-default font-medium text-tremor-content-strong"
                        >
                            Producto
                            <span className="mx-1 text-red-500">*</span>
                        </label>
                        <Select
                            id="product"
                            name="product"
                            className="mt-2 py-1"
                            placeholder="Productos"
                            value={idProductMovement}
                            onValueChange={setIdProductMovement}
                            required
                        >
                            {products?.map((product: ProductItem) => (
                                <SelectItem key={product.id} value={String(product.id)}>
                                    {product.name}
                                </SelectItem>
                            ))}
                        </Select>

                    </div>

                    <div className="col-span-full mt-3">
                        <label
                            htmlFor="cantidad"
                            className="text-tremor-default font-medium text-tremor-content-strong"
                        >
                            Cantidad
                            <span className="mx-1 text-red-500">*</span>
                        </label>
                        <NumberInput
                            id="cantidad"
                            name="cantidad"
                            placeholder="Precio..."
                            className="mt-2 py-1"
                            min={0}
                            value={quantityMovement}
                            onValueChange={(newValue) =>
                                setQuantityMovement(newValue)
                            }
                            required
                        />
                    </div>

                    <div className="col-span-full mt-3">
                        <label
                            htmlFor="TypeMovement"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Tipo de Movimiento
                            <span className="mx-1 text-red-500">*</span>
                        </label>
                        <Select
                            id="TypeMovement"
                            name="TypeMovement"
                            className="mt-2 py-1"
                            placeholder="Movimientos"
                            value={TypeMovement || ""}
                            onValueChange={setTypeMovement}
                            required
                        >
                            <SelectItem value={"entrada"}>Entrada</SelectItem>
                            <SelectItem value={"salida"}>Salida</SelectItem>
                        </Select>
                    </div>


                    <div className="mt-8 flex items-center justify-end space-x-2">
                        <Button
                            variant="light"
                            className="px-4 text-black"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            id="confirmDelete"
                            className="hover:bg-gray-600 px-8 bg-gray-800 border-gray-800"
                            loading={loaderNewMovement}
                            onClick={createNewMovement}
                            disabled={disableMovementBtn}
                        >
                            Procesar Movimiento
                        </Button>
                    </div>
                </DialogPanel>
            </Dialog>

        </>
    )
}

export default Dashboard;