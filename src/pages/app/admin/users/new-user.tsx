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
import PrivateRoute from "../../../../../components/layouts/PrivateRoute";

const NewUser: NextPage = () => {
    const { isOnline, isOffline, error } = useIsOnline();
    const toast = useToast();
    const router = useRouter();
    const [loaderUser, setLoaderUser] = useState(false);
    const [role, setRole] = useState("");
    const [newUserData, setNewUserData] = useState({
        username: "",
        password: "",
        role: "",
    });

    const createUser = async (e: React.FormEvent) => {
        setLoaderUser(true);
        e.preventDefault();

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username: newUserData.username,
                        password: newUserData.password,
                        role: role
                    }),
                }
            );
            const json = await res.json();
            console.log(json);

            if (res.status === 201) {
                setNewUserData({
                    username: "",
                    password: "",
                    role: ""
                });

                toast({
                    title: "Usuario Creado!",
                    description: "Se creo el usuario correctamente.",
                    status: "success",
                    position: "bottom",
                    duration: 4000,
                });

                router.push("/app/admin/users");
            } else {
                toast({
                    title: json.error || "Error al crear el usuario",
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
        setLoaderUser(false);
    };

    if (isOffline)
        return (
            <div className="full-screen-div italic text-gray-600">
                <h4>No Hay Conexión a Internet...</h4>
            </div>
        );

    return (
        <PrivateRoute allowedRoles={['admin']}>
            <div className="px-4 py-3 ">
                <h3 className="text-tremor-title font-semibold text-tremor-content-strong">
                    Nuevo Usuario
                </h3>
                <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                    Para agregar un nuevo usuario, rellena el siguiente formulario
                </p>
                <form className="mt-6">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="username"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Nombre de Usuario
                                <span className="mx-1 text-red-500">*</span>
                            </label>
                            <TextInput
                                type="text"
                                id="username"
                                name="username"
                                autoComplete="username"
                                placeholder="Usuario"
                                className="mt-2 py-1"
                                value={newUserData.username || ""}
                                onChange={(e) =>
                                    setNewUserData({ ...newUserData, username: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="password"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Contraseña de Usuario
                                <span className="mx-1 text-red-500">*</span>
                            </label>
                            <TextInput
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="password"
                                placeholder="Contraseña"
                                className="mt-2 py-1"
                                value={newUserData.password || ""}
                                onChange={(e) =>
                                    setNewUserData({ ...newUserData, password: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="col-span-full">
                            <label
                                htmlFor="role"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Rol
                                <span className="mx-1 text-red-500">*</span>
                            </label>
                            <Select
                                id="role"
                                name="role"
                                className="mt-2 py-1"
                                placeholder="Roles"
                                value={role || ""}
                                onValueChange={setRole}
                                required
                            >
                                <SelectItem value={"admin"}>Admin</SelectItem>
                                <SelectItem value={"employee"}>Empleado</SelectItem>
                                <SelectItem value={"guest"}>Visitante</SelectItem>
                            </Select>
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
                            onClick={createUser}
                            loading={loaderUser}
                            loadingText={"Creando..."}
                        >
                            Crear
                        </Button>
                    </div>
                </form>
            </div>
        </PrivateRoute>
    );
};

export default NewUser;
