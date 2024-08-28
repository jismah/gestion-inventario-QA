import { useToast } from "@chakra-ui/react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Divider,
  NumberInput,
  Select,
  SelectItem,
  TextInput,
  Textarea,
} from "@tremor/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useIsOnline } from "react-use-is-online";

const NewClient: NextPage = () => {
  const { isOnline, isOffline, error } = useIsOnline();
  const toast = useToast();
  const router = useRouter();
  const [loaderProducto, setLoaderProducto] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [newProductData, setNewProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    min_stock: 0,
  });

  const createProduct = async (e: React.FormEvent) => {
    setLoaderProducto(true);
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Incluir cookies de sesión
          body: JSON.stringify({
            name: newProductData.name,
            description: newProductData.description,
            category: categoria,
            price: newProductData.price,
            stock: newProductData.stock,
            min_stock: newProductData.min_stock
          }),
        }
      );
      const json = await res.json();
      console.log(json);

      if (res.status === 201) {
        setNewProductData({
          name: "",
          description: "",
          category: "",
          price: 0,
          stock: 0,
          min_stock: 0
        });

        toast({
          title: "Producto Creado!",
          description: "Se creo el producto correctamente.",
          status: "success",
          position: "bottom",
          duration: 4000,
        });

        router.push("/app/products");
      } else {
        toast({
          title: json.error || "Error al crear el producto",
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
    setLoaderProducto(false);
  };

  if (isOffline)
    return (
      <div className="full-screen-div italic text-gray-600">
        <h4>No Hay Conexión a Internet...</h4>
      </div>
    );

  return (
    <>
      <div className="px-4 py-3 ">
        <h3 className="text-tremor-title font-semibold text-tremor-content-strong">
          Nuevo Producto
        </h3>
        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          Para agregar un nuevo producto, rellena el siguiente formulario
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
                onChange={(e) =>
                  setNewProductData({ ...newProductData, name: e.target.value })
                }
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
                value={categoria || ""}
                onValueChange={setCategoria}
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
                onChange={(e) =>
                  setNewProductData({
                    ...newProductData,
                    description: e.target.value,
                  })
                }
                className="mt-2"
              />
            </div>

            <div className="col-span-full sm:col-span-2">
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
                onValueChange={(newValue) =>
                  setNewProductData({ ...newProductData, price: newValue })
                }
                enableStepper={false}
                icon={CurrencyDollarIcon}
                placeholder="Precio..."
                className="mt-2 py-1"
                required
              />
            </div>

            <div className="col-span-full sm:col-span-2">
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
                onValueChange={(newValue) =>
                  setNewProductData({ ...newProductData, stock: newValue })
                }
                enableStepper={true}
                placeholder="Cantidad..."
                className="mt-2 py-1"
                required
              />
            </div>

            <div className="col-span-full sm:col-span-2">
              <label
                htmlFor="stock_min"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Cantidad Minima
                <span className="mx-1 text-red-500">*</span>
              </label>
              <NumberInput
                id="stock_min"
                name="stock_min"
                value={newProductData.min_stock}
                onValueChange={(newValue) =>
                  setNewProductData({ ...newProductData, min_stock: newValue })
                }
                enableStepper={true}
                placeholder="Cantidad..."
                className="mt-2 py-1"
                required
              />
            </div>
          </div>

          <Divider />

          <div className="flex items-center justify-end space-x-4">
            <Link href={"/app/products"}>
              <button
                type="button"
                className="whitespace-nowrap rounded-tremor-small px-4 py-2.5 text-tremor-default font-medium text-tremor-content-strong"
              >
                Cancelar
              </button>
            </Link>

            <Button
              type="submit"
              id="submit"
              name="submit"
              className="bg-gray-800 border-gray-800 hover:bg-gray-600 px-10"
              onClick={createProduct}
              loading={loaderProducto}
              loadingText={"Creando..."}
            >
              Crear
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewClient;
