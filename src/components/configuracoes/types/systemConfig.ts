
export type SystemConfigKey = 
  | 'google_maps_api_key'
  | 'system_name'
  | 'enable_feature_x'
  | 'max_upload_size';

export interface SystemConfig {
  key: SystemConfigKey;
  value: string;
}
