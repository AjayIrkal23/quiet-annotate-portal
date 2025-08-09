export interface ViolationDetail {
  name: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
}

export interface ImageData {
  _id?: string;
  imagePath: string;
  imageName: string;
  violationDetails: ViolationDetail[];
}

export interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  violationName: string;
}

export interface CurrentBox {
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  violationName?: string;
}

export interface AnnotationSubmission {
  imageId: string;
  annotations: BoundingBox[];
}
