
const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;
    return (
        <div>
            Detail track slug : {slug}
        </div>
    );
}

export default DetailTrackPage;
