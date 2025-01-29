import lru from "@/helpers/lru";
import { mru } from "@/helpers/mru";
import { fifo } from "@/helpers/fifo";
import { optimal } from "@/helpers/optimal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { refString, frames, algo } = await request.json();
  const refArr = refString.split(' ').map((e: string) => parseInt(e));
  const frameCount = parseInt(frames);
  let result;

  switch (algo) {
    case "lru":
      result = lru(refArr, frameCount);
      break;
    case "mru":
      result = mru(refArr, frameCount);
      break;
    case "fifo":
      result = fifo(refArr, frameCount);
      break;
    case "optimal":
      result = optimal(refArr, frameCount);
      break;
    default:
      return NextResponse.json({ error: "Invalid algorithm" }, { status: 400 });
  }

  return NextResponse.json({
    result,
    refArr,
    frameCount
  }, {
    status: 200
  });
}
