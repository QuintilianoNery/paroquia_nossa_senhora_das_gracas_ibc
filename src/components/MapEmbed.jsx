export default function MapEmbed({ mapsUrl, address, compact = false }) {
  return (
    <div className={`map-embed ${compact ? 'compact' : ''}`.trim()}>
      {mapsUrl ? (
        <iframe
          title={address || 'Mapa da paróquia'}
          src={mapsUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="map-placeholder">
          <strong>Mapa integrado</strong>
          <span>{address || 'Adicione um link do Google Maps no cadastro.'}</span>
        </div>
      )}
    </div>
  );
}