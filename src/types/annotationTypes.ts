
export interface ViolationDetail {
  name: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ImageData {
  _id: {
    $oid: string;
  };
  imagePath: string;
  imageName: string;
  violationDetails: ViolationDetail[];
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
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
