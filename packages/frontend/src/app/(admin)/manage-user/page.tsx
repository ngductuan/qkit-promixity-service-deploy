'use client'
import { DeleteOutlined, EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import {
  Button,
  Dropdown,
  Flex,
  MenuProps,
  Table,
  TableProps,
  Tag,
  Typography,
  Pagination,
  Row,
  Col,
  Space
} from 'antd'
import { useRef, useState } from 'react'
import userData from './user-data.json'
import { PlusOutlined } from '@ant-design/icons'
import TableComponent from '@/app/components/admin/Table/Table'
import { IUserInformation } from '@/types/user'
import ViewRowDetailsModal, { ViewRowDetailsModalMethods } from '@/app/components/admin/ViewRowDetails/ViewRowDetails'

const { Text } = Typography

export interface IManageUserProps {}

type ColumnsType<T extends object> = TableProps<T>['columns']

const ManageUser = () => {
  const [userOption, setUserOption] = useState()
  const refUserModal = useRef<ViewRowDetailsModalMethods | null>(null)

  const listColumns: ColumnsType<IUserInformation> = [
    {
      width: 75,
      align: 'center',
      render: () => {
        const items: MenuProps['items'] = [
          {
            key: 'Xem chi tiết',
            label: <span>Xem chi tiết</span>,
            icon: <FolderViewOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
          },
          ...(!(userOption === '2')
            ? [
                {
                  key: 'Phân quyền',
                  label: <span>Phân quyền</span>,
                  icon: <UserAddOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
                }
              ]
            : []),
          ...(!(userOption === '2')
            ? [
                {
                  key: 'Xoá',
                  label: <span>Xoá</span>,
                  icon: <DeleteOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
                }
              ]
            : [
                {
                  key: 'Khôi phục',
                  label: <span>Khôi phục</span>,
                  icon: <UndoOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
                }
              ])
        ]
        return (
          <>
            <Dropdown menu={{ items }} placement='bottom' trigger={['click']}>
              <EllipsisOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
            </Dropdown>
          </>
        )
      }
    },
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: 200
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 200
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      width: 250,
      render: (roles: string[]) => (
        <Flex justify='center' wrap>
          {roles?.map((role, _index) => {
            const color = role == 'ADMIN' ? 'green' : 'geekblue'
            return (
              <Tag color={color} key={role} style={{ margin: '4px 0px 0px 4px' }}>
                {role}
              </Tag>
            )
          })}
        </Flex>
      )
    }
  ]

  const options = [
    {
      value: '1',
      label: 'Người dùng còn hoạt động'
    },
    {
      value: '2',
      label: 'Người dùng đã bị xoá'
    }
  ]

  const usersWithKeys = userData.map((item, index) => ({ ...item, key: index }))

  return (
    <>
      <Flex justify='space-between' style={{ marginBottom: 16, height: 40 }}>
        <Typography.Title className='mb-0' level={3}>
          User
        </Typography.Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          className='h-100'
          style={{
            fontWeight: 700,
            padding: '0 20px'
          }}
        >
          Add User
        </Button>
      </Flex>
      <TableComponent
        isFetching={false}
        columns={listColumns}
        dataSource={usersWithKeys}
        className='--manage-user-table'
      />
      <ViewRowDetailsModal title={''} data={null}>
        <Row>
          <Col span={8}>
            <Space direction='vertical'>
              <Text>Họ:</Text>
              <Text>Tên:</Text>
              <Text>Email:</Text>
              <Text>Số điện thoại:</Text>
              <Text>Địa chỉ:</Text>
            </Space>
          </Col>

          <Col span={16}>
            <Space direction='vertical'>
              {/* <Text> {userOne.}</Text>
                <Text> {userOne.}</Text>
                <Text> {userOne?.email}</Text>
                <Text> {userOne?.phone}</Text>
                <Text> {userOne?.address}</Text> */}
            </Space>
          </Col>
        </Row>
      </ViewRowDetailsModal>
    </>
  )
}

export default ManageUser
