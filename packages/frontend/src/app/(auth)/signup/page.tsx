'use client'
import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRegistrationOTPMutation } from '@/services/otp.service'
import { useGetDistrictByProvinceCodeQuery, useGetProvincesQuery } from '@/services/address.service'
import { ToastService } from '@/services/toast.service'
import { useRegisterUserMutation } from '@/services/auth.service'
import { useRouter } from 'next/navigation'
import { ErrorRespone, RegisterData, RegisterDataErrors } from '@/types/error'
import { ProvincesQueryResponse, DistrictsQueryResponse, Province, District } from '@/types/address'
import Image from 'next/image'

export default function SignUp() {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')

  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    city: '',
    province: '',
    country: 'Vietnam',
    otp: ''
  })

  const [registerDataErrors, setRegisterDataErrors] = useState<RegisterDataErrors>({})

  const [isGetOTP, setIsGetOTP] = useState(true)
  const toastService = useMemo(() => new ToastService(), [])
  const router = useRouter()

  const [registrationOTP, { isSuccess: isOTPSuccess, isError: isOTPError, error: otpError }] =
    useRegistrationOTPMutation()

  const [registerUser, { isSuccess: isRegisterSuccess, isError: isRegisterError, error: registerError }] =
    useRegisterUserMutation()

  const { data: provincesData, isSuccess: isProvincesSuccess } = useGetProvincesQuery<ProvincesQueryResponse>({})
  const { data: districtData, isSuccess: isDistrictsSuccess } =
    useGetDistrictByProvinceCodeQuery<DistrictsQueryResponse>(selectedProvince)

  useEffect(() => {
    if (isProvincesSuccess && provincesData) {
      setProvinces(provincesData.items)
    }
  }, [isProvincesSuccess, provincesData])

  useEffect(() => {
    if (isDistrictsSuccess && districtData) {
      setDistricts(districtData.items)
    }
  }, [isDistrictsSuccess, districtData])

  useEffect(() => {
    setSelectedDistrict('')
  }, [selectedProvince])

  useEffect(() => {
    if (selectedProvince && provincesData) {
      const selectedProvinceData = provincesData.items.find((province: Province) => province.code === selectedProvince)
      if (selectedProvinceData) {
        setRegisterData((prevData) => ({
          ...prevData,
          city: selectedProvinceData.full_name,
          province: ''
        }))
      }
    }
  }, [selectedProvince, provincesData])

  useEffect(() => {
    if (selectedDistrict && districtData) {
      const selectedDistrictData = districtData.items.find((district: District) => district.code === selectedDistrict)
      if (selectedDistrictData) {
        setRegisterData((prevData) => ({
          ...prevData,
          province: selectedDistrictData.full_name
        }))
      }
    }
  }, [selectedDistrict, districtData])

  const SignUp = async () => {
    if (registerData.password !== registerData.rePassword) {
      toast.error('Password and re-password do not match')
      setRegisterDataErrors((prevData) => ({
        ...prevData,
        rePassword: 'Password and re-password do not match',
        password: 'Password and re-password do not match'
      }))
      return
    }

    await registerUser({
      email: registerData.email,
      password: registerData.password,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      phoneNumber: registerData.phoneNumber,
      city: registerData.city,
      province: registerData.province,
      country: registerData.country,
      otp: registerData.otp
    })
  }

  const handleSignUp = () => {
    SignUp()
      .then(() => {})
      .catch(() => {
        toastService.error('Error to register')
      })
  }

  const GetOTP = async () => {
    if (!registerData.email) {
      toastService.error('Please input email')
      return
    }

    await registrationOTP({
      email: registerData.email
    })
  }

  const handleGetOTP = () => {
    GetOTP()
      .then(() => {})
      .catch(() => {
        toastService.error('Error to get OTP')
      })
  }

  useEffect(() => {
    if (isOTPSuccess) {
      toastService.success('OTP sent to your email')
      setIsGetOTP(false)
    }
    if (isOTPError) {
      const errorResponse = otpError as ErrorRespone
      handleError(errorResponse)
      toastService.showRestError(errorResponse)
    }
  }, [isOTPSuccess, isOTPError])

  useEffect(() => {
    if (isRegisterSuccess) {
      toastService.success('Registered successfully')
      router.push('/signin')
    }
    if (isRegisterError) {
      const errorResponse = registerError as ErrorRespone
      handleError(errorResponse)
      toastService.showRestError(errorResponse)
    }
  }, [isRegisterSuccess, isRegisterError])

  const handleError = (error: ErrorRespone) => {
    if (error?.data?.errors) {
      setRegisterDataErrors((prevInputError) => {
        const newInputError: RegisterDataErrors = { ...prevInputError }
        const inputTypes: Array<keyof typeof newInputError> = [
          'email',
          'password',
          'firstName',
          'lastName',
          'phoneNumber',
          'city',
          'province',
          'country',
          'otp'
        ]
        inputTypes.forEach((type) => {
          if (error?.data?.errors && Array.isArray(error.data.errors[type]) && error.data.errors[type].length > 0) {
            newInputError[type] = error.data.errors[type][0]
          }
        })

        return newInputError
      })
    }
  }

  const onChangeRegisterData = (value: string, type: keyof RegisterData) => {
    setRegisterData({
      ...registerData,
      [type]: value
    })

    setRegisterDataErrors({
      ...registerDataErrors,
      [type]: ''
    })
  }

  const redirectHome = () => {
    router.push('/')
  }

  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <div className='content-wrapper'>
          <div className='content-full'>
            <div className='logo-wrapper'>
              <Image onClick={redirectHome} src='/logo.png' alt='logo' />
            </div>
            <div className='form-wrapper f-form'>
              <h2>Welcome to Proximity Service</h2>
              <div>Please Enter Information To Join With Us</div>
              <div className={`container ${!isGetOTP && 'fade-in'}`}>
                {isGetOTP ? (
                  <div className='row mt-5'>
                    <div className='col-3' />
                    <div className='col-6'>
                      <div className='form'>
                        <div className='mb-3'>
                          <label className='form-label'>Email address</label>
                          {registerDataErrors.email && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.email}</span>
                            </div>
                          )}
                          <input
                            value={registerData.email}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'email')}
                            type='email'
                            className={`form-control ${registerDataErrors.email ? 'error-input' : ''}`}
                            placeholder='name@example.com'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-3' />
                  </div>
                ) : (
                  <div className='row'>
                    <div className='col-6'>
                      <div className='form'>
                        <div className='mb-3'>
                          <label className='form-label'>OTP</label>
                          {registerDataErrors.otp && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.otp}</span>
                            </div>
                          )}
                          <input
                            value={registerData.otp}
                            type='text'
                            onChange={(e) => onChangeRegisterData(e.target.value, 'otp')}
                            className={`form-control ${registerDataErrors.otp ? 'error-input' : ''}`}
                            placeholder='Input OTP code with 6 digits'
                          ></input>
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Password</label>
                          {registerDataErrors.password && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.password}</span>
                            </div>
                          )}
                          <input
                            value={registerData.password}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'password')}
                            type='password'
                            className={`form-control ${registerDataErrors.password ? 'error-input' : ''}`}
                            placeholder='********'
                          />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Re-Password</label>
                          {registerDataErrors.rePassword && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.rePassword}</span>
                            </div>
                          )}
                          <input
                            value={registerData.rePassword || ''}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'rePassword')}
                            type='password'
                            className={`form-control ${registerDataErrors.rePassword ? 'error-input' : ''}`}
                            placeholder='********'
                          />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Phone Number</label>
                          {registerDataErrors.phoneNumber && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.phoneNumber}</span>
                            </div>
                          )}
                          <input
                            type='text'
                            className={`form-control ${registerDataErrors.phoneNumber ? 'error-input' : ''}`}
                            placeholder='0123456789'
                            value={registerData.phoneNumber}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'phoneNumber')}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-6'>
                      <div className='form'>
                        <div className='mb-3'>
                          <label className='form-label'>First name</label>
                          {registerDataErrors.firstName && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.firstName}</span>
                            </div>
                          )}
                          <input
                            type='text'
                            className={`form-control ${registerDataErrors.firstName ? 'error-input' : ''}`}
                            placeholder='Chinh'
                            value={registerData.firstName}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'firstName')}
                          />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Last name</label>
                          {registerDataErrors.lastName && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.lastName}</span>
                            </div>
                          )}
                          <input
                            type='text'
                            className={`form-control ${registerDataErrors.lastName ? 'error-input' : ''}`}
                            placeholder='Truong Nguyen Cong'
                            value={registerData.lastName}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'lastName')}
                          />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Province</label>
                          {registerDataErrors.city && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.city}</span>
                            </div>
                          )}
                          <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className={`form-control ${registerDataErrors.city ? 'error-input' : ''}`}
                          >
                            <option value=''>--Choose Province--</option>
                            {provinces.map((province: Province) => (
                              <option key={province.code} value={province.code}>
                                {province.full_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>District</label>
                          {registerDataErrors.province && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.province}</span>
                            </div>
                          )}
                          <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className={`form-control ${registerDataErrors.province ? 'error-input' : ''}`}
                          >
                            <option value=''>--Choose District--</option>
                            {districts.map((district: District) => (
                              <option key={district.code} value={district.code}>
                                {district.full_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className='d-flex align-items-center justify-content-center'
              style={{ padding: '0 72x', flexDirection: 'column' }}
            >
              {isGetOTP ? (
                <button style={{ width: '200px' }} onClick={handleGetOTP} className='form-btn mt-3'>
                  Get OTP
                </button>
              ) : (
                <button style={{ width: '200px' }} onClick={handleSignUp} className='form-btn'>
                  Sign Up
                </button>
              )}
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                Already have an account?{' '}
                <strong style={{ cursor: 'pointer' }}>
                  <Link
                    style={{
                      textDecoration: 'none',
                      color: '#ed1651',
                      fontWeight: '300'
                    }}
                    href='/signin'
                  >
                    Login here
                  </Link>
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
