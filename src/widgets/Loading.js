export const Loading = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>);
}