import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { DataGridPreviewProps } from "./types";
import { useDataGridLogic } from "./useDataGridLogic";
import { DataGridHeader } from "./parts/Header";
import { DataGridToolbar } from "./parts/Toolbar";
import { DataGridFooter } from "./parts/Footer";
import { ConfirmationModal } from "./parts/ConfirmationModal";
import { DataGridTable } from "./parts/Table";

export default function DataGridEditor({
  loading,
  file,
  breadcrumbs,
  onSave,
}: DataGridPreviewProps) {
  const logic = useDataGridLogic(file, onSave);

  return (
    <div className="w-full text-left p-10 relative">
      <ConfirmationModal
        isOpen={logic.showDiscardModal}
        title="Descartar cambios"
        message="¿Estás seguro de que quieres descartar todos los cambios no guardados? Volverás al estado inicial del archivo."
        confirmText="Sí, descartar"
        confirmButtonColor="bg-gray-600 hover:bg-gray-700" // color distinto para distinguir de borrar
        onConfirm={logic.confirmDiscard}
        onCancel={() => logic.setShowDiscardModal(false)}
      />

      <ConfirmationModal
        isOpen={logic.showDeleteModal}
        title="Eliminar registros"
        message={`¿Estás seguro de que quieres eliminar ${logic.selectedRowIndices.size} registro(s)? Esta acción no se aplicará en la base de datos hasta que hagas clic en 'Guardar Cambios'.`}
        confirmText="Eliminar"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
        onConfirm={logic.confirmDelete}
        onCancel={() => logic.setShowDeleteModal(false)}
      />

      <DataGridHeader
        loading={loading}
        tableName={breadcrumbs?.tableName}
        pageSize={logic.pageSize}
        setPageSize={logic.setPageSize}
        visibleColumns={logic.visibleColumns}
        headers={logic.headers}
        setVisibleColumns={logic.setVisibleColumns}
      />

      <DataGridToolbar
        loading={loading}
        selectedCount={logic.selectedRowIndices.size}
        isDirty={logic.isDirty}
        onAdd={logic.handleAddRow}
        onEdit={logic.handleEditSelected}
        onDelete={logic.handleDeleteRequest}
        onSave={logic.handleSave}
        onDiscard={() => logic.setShowDiscardModal(true)}
      />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible flex flex-col">
        {!loading && !file?.isEmpty && (
          <DataGridTable
            paginatedRows={logic.paginatedRows}
            visibleColumns={logic.visibleColumns}
            selectedRowIndices={logic.selectedRowIndices}
            editingRowIndices={logic.editingRowIndices}
            startIndex={logic.startIndex}
            activeFilters={logic.activeFilters}
            openFilterColumn={logic.openFilterColumn}
            filterSearchTerm={logic.filterSearchTerm}
            sortConfig={logic.sortConfig}
            onToggleRowSelection={logic.toggleRowSelection}
            onToggleSelectAll={logic.toggleSelectAll}
            onInputChange={logic.handleInputChange}
            onOpenFilter={logic.setOpenFilterColumn}
            onFilterSearch={logic.setFilterSearchTerm}
            onFilterValueChange={logic.handleFilterValueChange}
            onSelectAllFilter={logic.handleSelectAllFilter}
            getUniqueValues={logic.getUniqueValues}
            filteredRowsWithIndex={logic.filteredRowsWithIndex}
            onSort={logic.handleSort}
          />
        )}

        {loading && (
          <div className="p-10">
            <Skeleton count={5} />
          </div>
        )}
        {!loading && file?.isEmpty && (
          <div className="p-10 text-center text-gray-500">Sin datos</div>
        )}

        {!loading && !file?.isEmpty && (
          <DataGridFooter
            startIndex={logic.startIndex}
            pageSize={logic.pageSize}
            totalItems={logic.totalItems}
            currentPage={logic.currentPage}
            totalPages={logic.totalPages}
            isDirty={logic.isDirty}
            onPrev={() => logic.setCurrentPage((p) => Math.max(p - 1, 1))}
            onNext={() =>
              logic.setCurrentPage((p) => Math.min(p + 1, logic.totalPages))
            }
          />
        )}
      </div>
    </div>
  );
}
