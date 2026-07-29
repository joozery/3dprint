declare module 'occt-import-js' {
    interface OcctMeshAttribute {
        array: number[];
    }
    interface OcctMesh {
        name: string;
        attributes: {
            position: OcctMeshAttribute;
            normal?: OcctMeshAttribute;
        };
        index?: OcctMeshAttribute;
        color?: [number, number, number];
        brep_faces?: Array<{ first: number; last: number; color?: [number, number, number] }>;
    }
    interface OcctResult {
        success: boolean;
        meshes: OcctMesh[];
    }
    interface OcctInstance {
        ReadStepFile(buffer: Uint8Array, params: null): OcctResult;
    }
    interface OcctInitOptions {
        locateFile?: (name: string) => string;
    }
    function occtimportjs(options?: OcctInitOptions): Promise<OcctInstance>;
    export default occtimportjs;
}
