import {
  COUNT_10_THOUSAND,
  MUTATION_FOUR_FIELD_CREATE,
  SCHEMA_FOUR_FIELDS_FINAL_TWO_INDEXED,
  SCHEMA_FOUR_FIELDS_INITIAL_TWO_INDEXED,
} from '../deploy-velocity/deploy-velocity-constants';
import { DURATION_30_MINUTES } from '../../utils/duration-constants';
import {
  recordCountDataProvider,
  recordCountDataValidator,
  testManagedTableDeployment,
} from '../deploy-velocity/deploy-velocity-test-core';

testManagedTableDeployment({
  name: 'Replace 2 GSIs updated - 10k Records',
  maxDeployDurationMs: DURATION_30_MINUTES,
  initialSchema: SCHEMA_FOUR_FIELDS_INITIAL_TWO_INDEXED,
  updatedSchema: SCHEMA_FOUR_FIELDS_FINAL_TWO_INDEXED,
  dataSetup: recordCountDataProvider(COUNT_10_THOUSAND, MUTATION_FOUR_FIELD_CREATE),
  dataValidate: recordCountDataValidator(COUNT_10_THOUSAND),
});
