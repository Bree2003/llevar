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
    <div className="w-full relative">
      {/* DESCARTAR */}
      <ConfirmationModal
        isOpen={logic.showDiscardModal}
        title="Descartar cambios"
        message="¿Estás seguro de que quieres descartar todos los cambios no guardados? Volverás al estado inicial del archivo."
        confirmText="Sí, descartar"
        confirmButtonColor="bg-gray-600 hover:bg-gray-700"
        onConfirm={logic.confirmDiscard}
        onCancel={() => logic.setShowDiscardModal(false)}
      />

      {/* ELIMINAR */}
      <ConfirmationModal
        isOpen={logic.showDeleteModal}
        title="Eliminar registros"
        message={`¿Estás seguro de que quieres eliminar ${logic.selectedRowIndices.size} registro(s)? Esta acción no se aplicará en la base de datos hasta que hagas clic en 'Guardar cambios'.`}
        confirmText="Eliminar"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
        onConfirm={logic.confirmDelete}
        onCancel={() => logic.setShowDeleteModal(false)}
      />

      {/* HEADER */}
      <DataGridHeader
        loading={loading}
        tableName={breadcrumbs?.tableName}
        pageSize={logic.pageSize}
        setPageSize={logic.setPageSize}
        visibleColumns={logic.visibleColumns}
        headers={logic.headers}
        setVisibleColumns={logic.setVisibleColumns}
      />

      {/* CARD PRINCIPAL */}
      <section
        className="
          w-full

          bg-white

          border
          border-[--color-border]

          rounded-2xl

          shadow-sm

          overflow-visible
        "
      >
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

        {loading && (
          <div
            className="
              p-6
              md:p-10
            "
          >
            <Skeleton count={7} height={24} />
          </div>
        )}

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

        {!loading && file?.isEmpty && (
          <div
            className="
                py-12
                md:py-16
                px-5

                text-center
              "
          >
            <h3
              className="
                  text-lg
                  font-semibold
                  text-[--color-text-primary]
                "
            >
              Sin datos disponibles
            </h3>

            <p
              className="
                  mt-2
                  text-sm
                  text-[--color-text-secondary]
                "
            >
              Esta tabla todavía no contiene registros para visualizar.
            </p>
          </div>
        )}

        {!loading && !file?.isEmpty && (
          <DataGridFooter
            startIndex={logic.startIndex}
            pageSize={logic.pageSize}
            totalItems={logic.totalItems}
            currentPage={logic.currentPage}
            totalPages={logic.totalPages}
            isDirty={logic.isDirty}
            onPrev={() => logic.setCurrentPage((page) => Math.max(page - 1, 1))}
            onNext={() =>
              logic.setCurrentPage((page) =>
                Math.min(page + 1, logic.totalPages),
              )
            }
          />
        )}
      </section>
    </div>
  );
}
