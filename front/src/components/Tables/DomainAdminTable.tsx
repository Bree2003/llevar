import { useState, ChangeEvent } from 'react';
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

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>, d: DomainModel) => {
        return;
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Dominio</TableCell>
                                <TableCell align="left">Descripcion</TableCell>
                                <TableCell align="center">Activo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading !== false ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        Cargando los datos...
                                    </TableCell>
                                </TableRow>
                            ) : domainData === undefined || domainData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No hay datos para mostrar
                                    </TableCell>
                                </TableRow>
                            ) : (
                                domainData.map((d) => (
                                    <TableRow
                                        key={d.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{d.name}</TableCell>
                                        <TableCell align="left">{d.description}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Activar/Desactivar usuario">
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
                    component="div"
                    count={domainData?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
