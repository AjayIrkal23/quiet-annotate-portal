
export interface Issue {
  value: string;
  label: string;
  color: string;
}

export interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  issue: string;
}

export interface CurrentBox {
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  issue?: string;
}
