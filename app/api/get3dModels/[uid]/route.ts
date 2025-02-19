export async function GET({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  const url = `https://webapp.engineeringlumalabs.com/api/v3/creations/uuid/${uid}`;
  const options = {
    method: "GET",
  };
  const response = await fetch(url, options);
  console.log(response);
  return response;
}
