'use client'

import dataProviderSimpleRest from '@refinedev/simple-rest'
import { axiosInstance } from '@utility/axios-instance'

const API_URL = 'http://localhost:3000/api'

export const dataProvider = dataProviderSimpleRest(API_URL, axiosInstance)
