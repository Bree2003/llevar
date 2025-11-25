// screens/Main/UploadScreen.tsx
import React from "react";
import { EnvironmentModel } from "store/models/gcsData";
import { EndpointName, EndpointStatus, UploadModel } from "controllers/Main/UploadController";
import Loading from "components/Global/Loading/Loading";

interface UploadScreenProps {
  environments: EnvironmentModel[];
  environmentsLoading: boolean;
  model: Partial<UploadModel>;
  endpoints?: Partial<Record<EndpointName, EndpointStatus>>;
  onEnvChange: (envId: string) => void;
  onBucketChange: (bucketName: string) => void;
  onRootClick: () => void;
  onFolderClick: (folderName: string) => void;
  onBreadcrumbClick: (index: number) => void;
  onFileSelect: (file: File | undefined) => void;
  onUploadFile: () => void;
}

const UploadScreen = ({
  environments,
  environmentsLoading,
  model,
  endpoints,
  onEnvChange,
  onBucketChange,
  onRootClick,
  onFolderClick,
  onBreadcrumbClick,
  onFileSelect,
  onUploadFile,
}: UploadScreenProps) => {

  const selectedEnv = environments.find(env => env.id === model.selectedEnvId);

  if (environmentsLoading) {
    return <Loading message="Cargando configuración de entornos..." />;
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Plataforma de Carga de Datos</h1>

      <section style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <div>
          <label htmlFor="env-select">1. Seleccione un Entorno:</label><br/>
          <select id="env-select" onChange={(e) => onEnvChange(e.target.value)} value={model.selectedEnvId || ''}>
            <option value="" disabled>-- Entornos --</option>
            {environments.map(env => <option key={env.id} value={env.id}>{env.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="bucket-select">2. Seleccione un Bucket:</label><br/>
          <select id="bucket-select" onChange={(e) => onBucketChange(e.target.value)} value={model.selectedBucket || ''} disabled={!selectedEnv}>
            <option value="" disabled>-- Buckets --</option>
            {selectedEnv?.buckets.map(bucket => <option key={bucket} value={bucket}>{bucket}</option>)}
          </select>
        </div>
      </section>

      {model.selectedBucket && (
        <section style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>3. Navegue a la Tabla de Destino</h3>
            <div>
                <strong onClick={onRootClick} style={{cursor: 'pointer', color: 'darkblue'}}>
                    {model.selectedBucket}
                </strong>
                {model.breadcrumbs?.map((crumb, index) => (
                    <span key={index} onClick={() => onBreadcrumbClick(index)} style={{cursor: 'pointer'}}>
                        {' / '}{crumb}
                    </span>
                ))}
            </div>

            <div style={{ marginTop: '10px', minHeight: '100px' }}>
                {(endpoints?.loadProducts?.loading || endpoints?.loadTables?.loading) ? (
                    <p>Cargando carpetas...</p>
                ) : (
                    <ul>
                        {/* Esta lógica ahora funciona porque el estado se limpia correctamente */}
                        {(model.tables && model.tables.length > 0 ? model.tables : model.products || []).map(folder => (
                            <li key={folder} onClick={() => onFolderClick(folder)} style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>
                                {folder}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
      )}

      {model.breadcrumbs && model.breadcrumbs.length > 0 && (
          <section style={{ border: '1px solid #ccc', padding: '10px' }}>
              <h3>4. Seleccione y Suba el Archivo</h3>
              <p>Destino: <strong>{model.breadcrumbs.join('/')}</strong></p>
              <input 
                type="file" 
                onChange={(e) => onFileSelect(e.target.files?.[0])}
                accept=".csv,.xlsx,.xls"
              />
              <button onClick={onUploadFile} disabled={!model.fileToUpload || endpoints?.uploadFile?.loading}>
                {endpoints?.uploadFile?.loading ? 'Subiendo...' : 'Subir Archivo'}
              </button>
              {endpoints?.uploadFile?.error && <p style={{color: 'red'}}>Error: {endpoints.uploadFile.errorMessage}</p>}
          </section>
      )}
    </main>
  );
};

export default UploadScreen;