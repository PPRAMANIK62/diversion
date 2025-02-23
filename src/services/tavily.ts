"use server";

const API_KEY = process.env.TAVILY_API_KEY!;

export async function getSearchResults(
  searchQuery: string
): Promise<SearchResponse> {
  const apiUrl = "https://api.tavily.com/search";

  const requestPayload = {
    api_key: API_KEY,
    query: searchQuery,
    topic: "general",
    include_images: true,
    include_answer: true,
    include_image_descriptions: true,
    include_raw_content: false,
    max_results: 6,
  };

  try {
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestPayload),
    });
    if (!apiResponse.ok) {
      throw new Error(
        `Failed to fetch search results: ${apiResponse.statusText}`
      );
    }

    const responseJson: SearchResponse = await apiResponse.json();
    return responseJson;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw new Error(
      "An error occurred while fetching search results. Please try again later."
    );
  }
}
