// Core types for FiCo Studio

export type Language = 'TR' | 'EN' | 'AR';
export type AppTab = 'logic' | 'telemetry' | 'tasks';
export type BlockCategory = 'events' | 'motion' | 'control' | 'logic' | 'sensors';

export interface BlockParam {
  name: string;
  defaultValue: number;
  unit: string;
}

export interface BlockDef {
  id: string;
  category: BlockCategory;
  label: string;
  isHat?: boolean;        // event hat blocks (no left connector)
  isContainer?: boolean;  // blocks that hold children
  params?: BlockParam[];
}

export interface ParamValue {
  name: string;
  value: number;
}

export interface BlockInstance {
  id: string;
  defId: string;
  params: ParamValue[];
  children: BlockInstance[];
}

export interface TelemetryData {
  altitude: number;
  velocity: number;
  battery: number;
  heading: number;
  isFlying: boolean;
}

export type BlockAction =
  | { type: 'ADD_BLOCK'; defId: string; defaultParams: ParamValue[]; index?: number }
  | { type: 'DELETE_BLOCK'; id: string }
  | { type: 'MOVE_BLOCK'; fromIndex: number; toIndex: number }
  | { type: 'UPDATE_PARAM'; blockId: string; paramName: string; value: number }
  | { type: 'ADD_CHILD_BLOCK'; parentId: string; defId: string; defaultParams: ParamValue[] };
