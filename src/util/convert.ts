import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export type Actions = {
  file: string;
  file_name: string;
  file_size: number;
  from: string;
  to: string | null;
  file_type: string;
  is_converting?: boolean;
  is_converted?: boolean;
  is_error?: boolean;
  url?: string;
  output?: string;
};

function getFileExtension(file_name: string): string {
  const regex = /(?:\.([^.]+))?$/; // Matches the last dot and everything after it
  const match = regex.exec(file_name);
  return match?.[1] || ""; // Return the extension or an empty string
}

function removeFileExtension(file_name: string): string {
  const lastDotIndex = file_name.lastIndexOf(".");
  return lastDotIndex !== -1 ? file_name.slice(0, lastDotIndex) : file_name;
}

// Define the result type of the conversion
type ConversionResult = {
  url: string;
  output: string;
};

export default async function convertFile(
  ffmpeg: FFmpeg,
  action: Actions
): Promise<ConversionResult | { error: string }> {
  const { file, to, file_name, file_type } = action;

  if (!to) {
    return { error: "Target format (to) is required." };
  }

  const input = getFileExtension(file_name);
  const output = removeFileExtension(file_name) + "." + to;

  try {
    // Write file to the virtual file system
    await ffmpeg.writeFile(input, await fetchFile(file));

    // FFmpeg command logic for different formats
    let ffmpeg_cmd: string[] = [];
    if (to === "3gp") {
      ffmpeg_cmd = [
        "-i", input,
        "-r", "20",
        "-s", "352x288",
        "-vb", "400k",
        "-acodec", "aac",
        "-strict", "experimental",
        "-ac", "1",
        "-ar", "8000",
        "-ab", "24k",
        output,
      ];
    } else {
      ffmpeg_cmd = ["-i", input, output];
    }

    // Execute the FFmpeg command
    await ffmpeg.exec(ffmpeg_cmd);

    // Read the output file from the virtual file system
    const data = await ffmpeg.readFile(output);
    const blob = new Blob([data], { type: file_type.split("/")[0] });

    // Create a URL for the converted file
    const url = URL.createObjectURL(blob);

    return { url, output };
  } catch (error) {
    console.error("Error during conversion:", error);
    return { error: "An error occurred during file conversion." };
  }
}
