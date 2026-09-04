import { useState, useMemo, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserModel } from 'models/Admin/usersModel';
import { useAppSelector } from "store/hooks/redux-hooks";


export default function UserAdminTable({
    userData,
    isLoading,
    handleUserUpdate,
}: {
    userData: UserModel[] | undefined;
    isLoading: boolean | undefined;
    handleUserUpdate: (user: UserModel) => void;
}) {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    const { user } = useAppSelector((state) => state.UserPermissions);
    const userEmail = user?.email || '';

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>, u: UserModel) => {
        if (u.email === userEmail) {
            return;
        }

        const updatedUser = { ...u, active: u.active ? false : true };
        handleUserUpdate(updatedUser);
        return;
    };

    const paginatedData = useMemo(() => {
        if (!userData) {
            return [];
        }

        return userData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [userData, page, rowsPerPage]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Correo</TableCell>
                                <TableCell align="left">Nombre</TableCell>
                                <TableCell align="left">Apellido</TableCell>
                                <TableCell align="center">Dominios</TableCell>
                                <TableCell align="center">Permisos</TableCell>
                                <TableCell align="center">Activo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading !== false ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Cargando los datos...
                                    </TableCell>
                                </TableRow>
                            ) : paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No hay datos para mostrar
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((u) => (
                                    <TableRow
                                        key={u.oid}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{u.email}</TableCell>
                                        <TableCell align="left">{u.name}</TableCell>
                                        <TableCell align="left">{u.surname}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar dominios">
                                                <IconButton>
                                                    <SettingsIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar permisos">
                                                <IconButton>
                                                    <SettingsIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Activar/Desactivar usuario">
                                                <Switch
                                                    checked={u.active}
                                                    disabled={u.email === userEmail}
                                                    onChange={(event) => handleSwitchChange(event, u)}
                                                    slotProps={{ input: { 'aria-label': 'controlled' } }}
                                                />
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Filas por p&aacute;gina"
                    component="div"
                    count={userData?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
