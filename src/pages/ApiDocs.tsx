import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useEffect, useState } from 'react';

interface SwaggerSpec {
  [key: string]: unknown;
}

const ApiDocs = () => {
  const [spec, setSpec] = useState<SwaggerSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSwaggerSpec = async () => {
      try {
        setLoading(true);
        // Try to load from backend Swagger endpoint first
        try {
          const response = await fetch('http://localhost:8080/v3/api-docs', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });
          if (response.ok) {
            const data = await response.json();
            setSpec(data);
            setError(null);
            return;
          }
        } catch (backendErr) {
          console.log('Backend Swagger endpoint not available, trying local API spec...');
        }

        // Fallback to local api1.json
        const localResponse = await fetch('/api1.json');
        if (!localResponse.ok) {
          throw new Error('Failed to load API specification');
        }
        const data = await localResponse.json();
        setSpec(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load API specification');
        console.error('Error loading Swagger spec:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSwaggerSpec();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error Loading API Docs</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Make sure the backend server is running at <code className="bg-muted px-2 py-1 rounded">http://localhost:8080</code> or check that <code className="bg-muted px-2 py-1 rounded">api1.json</code> exists in the public folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {spec && (
        <SwaggerUI
          spec={spec}
          url="/api1.json"
          tryItOutEnabled={true}
          requestSnippetsEnabled={true}
          defaultModelsExpandDepth={1}
          defaultModelExpandDepth={1}
          onComplete={() => {
            console.log('Swagger UI loaded successfully');
          }}
        />
      )}
      <style>{`
        .swagger-ui-wrapper {
          background: #fff;
        }
        .swagger-ui .topbar {
          background: #fafafa;
          border-bottom: 1px solid #e0e0e0;
        }
        .swagger-ui .info .title {
          color: #1976d2;
        }
      `}</style>
    </div>
  );
};

export default ApiDocs;
