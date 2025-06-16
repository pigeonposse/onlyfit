import { config }            from '@onlyfit/repo-config/unbuild'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [ { ...config } ] )
