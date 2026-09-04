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
import DomainModal from "components/AdminPlatform/DomainModal";
import { DomainModel } from 'models/Admin/domainsModel';


export default function DomainAdminTable({
    domainData,
    isLoading,
    handleDomainUpdate,
}: {
    domainData: DomainModel[] | undefined;
    isLoading: boolean | undefined;
    handleDomainUpdate: (domain: DomainModel) => void;
}) {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [editingDomain, setEditingDomain] = useState<DomainModel | null>(null);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOnDomainUpdate = (updatedDomain: DomainModel) => {
        handleDomainUpdate(updatedDomain);
        setEditingDomain(null);
        return;
    };

    const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>, d: DomainModel) => {
        const updatedDomain = { ...d, active: d.active ? false : true };
        handleDomainUpdate(updatedDomain);
        return;
    };

    const paginatedData = useMemo(() => {
        if(!domainData){
            return [];
        }

        return domainData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [domainData, page, rowsPerPage]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">ID</TableCell>
                                <TableCell align="left">Nombre</TableCell>
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
                                paginatedData.map((d) => (
                                    <TableRow
                                        key={d.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{d.id}</TableCell>
                                        <TableCell align="left">{d.name}</TableCell>
                                        <TableCell align="left">{d.description}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Modificar dominio">
                                                <IconButton onClick={() => setEditingDomain(d)}>
                                                    <SettingsIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Activar/Desactivar dominio">
                                                <Switch
                                                    checked={d.active}
                                                    onChange={(event) => handleSwitchChange(event, d)}
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
                    count={domainData?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {editingDomain && (
                <DomainModal
                    domain={editingDomain}
                    onClose={() => setEditingDomain(null)}
                    onSave={handleOnDomainUpdate}
                />
            )}
        </Box>
    );
}
