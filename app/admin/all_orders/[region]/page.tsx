interface OrderProps {
    params: {
        region: string;
    };
}

export default function Order({ params }: OrderProps) {
    const { region } = params;

    return (
        <div>
            <h1>Orders in Region: {region}</h1>
        </div>
    );
}
