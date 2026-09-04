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
import PermissionModal from "components/AdminPlatform/PermissionModal";
import { PermissionModel } from 'models/Admin/permissionsModel';


export default function PermissionAdminTable({
    permissionData,
    isLoading,
    handlePermissionUpdate,
}: {
    permissionData: PermissionModel[] | undefined;
    isLoading: boolean | undefined;
    handlePermissionUpdate: (permission: PermissionModel) => void;
}) {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [editingPermission, setEditingPermission] = useState<PermissionModel | null>(null);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOnDomainUpdate = (updatedPermission: PermissionModel) => {
        handlePermissionUpdate(updatedPermission);
        setEditingPermission(null);
        return;
    };

    const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>, p: PermissionModel) => {
        const updatedPermission = { ...p, active: p.active ? false : true };
        handlePermissionUpdate(updatedPermission);
        return;
    };

    const paginatedData = useMemo(() => {
        if (!permissionData) {
            return [];
        }

        return permissionData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [permissionData, page, rowsPerPage]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">ID</TableCell>
                                <TableCell align="left">Permiso</TableCell>
                                <TableCell align="left">Descripción</TableCell>
                                <TableCell align="center">Editar</TableCell>
                                <TableCell align="center">Activo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading !== false ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Cargando los datos...
                                    </TableCell>
                                </TableRow>
                            ) : paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No hay datos para mostrar
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((p) => (
                                    <TableRow
                                        key={p.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{p.id}</TableCell>
                                        <TableCell align="left">{p.name}</TableCell>
                                        <TableCell align="left">{p.description}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Modificar dominio">
                                                <IconButton onClick={() => setEditingPermission(p)}>
                                                    <SettingsIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Activar/Desactivar usuario">
                                                <Switch
                                                    checked={p.active}
                                                    onChange={(event) => handleSwitchChange(event, p)}
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
                    count={permissionData?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {editingPermission && (
                <PermissionModal
                    permission={editingPermission}
                    onClose={() => setEditingPermission(null)}
                    onSave={handleOnDomainUpdate}
                />
            )}
        </Box>
    );
}
