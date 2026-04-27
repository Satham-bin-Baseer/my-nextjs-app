"use client";

import CardFixedTop from "../components/cardFixedTop";

const UsersMenu = () => {
  return (
    <>
      <CardFixedTop title="Employees CRUD"></CardFixedTop>
      {/* <Card className="mx-1">
        <p className="text-right mb-2">
          Total staff: <b>{pagi.total}</b>
        </p>
        <Table<DataType>
          columns={columns}
          dataSource={dataList}
          rowKey="id"
          pagination={pagi}
          loading={loader}
          onChange={(pagi) => {
            setPagination(pagi);
            getData(pagi.current!, pagi.pageSize!);
          }}
        />
      </Card>
      <Modal
        title="Create new username"
        open={addModal}
        onCancel={() => setAddModal(false)}
        okText="Create"
        onOk={addNewStaff}
        confirmLoading={loader}
      >
        <Card>
          <Row>
            <Col span={24}>
              <Row>
                <Col md={11}>
                  <label>
                    Username<label className="text-danger">*</label>
                  </label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value.toLowerCase())}
                    style={{ width: "100%" }}
                    placeholder="Enter username..."
                  />
                </Col>
                <Col md={2}></Col>
                <Col md={11}>
                  <label>
                    Password<label className="text-danger">*</label>
                  </label>
                  <Input
                    value={passWord}
                    onChange={(e) => setPassWord(e.target.value)}
                    style={{ width: "100%" }}
                    placeholder="Enter password..."
                  />
                </Col>
                <Col md={24} className="mt-2">
                  <label>
                    Select Staff<label className="text-danger">*</label>
                  </label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Staff"
                    value={selStaff}
                    showSearch={{ optionFilterProp: "label" }}
                    onChange={(val) => setSelStaff(val)}
                    options={empList.map(({ id, emp_name }) => ({
                      value: id,
                      label: emp_name,
                    }))}
                  />
                </Col>
                <Col md={24} className="mt-2">
                  <label>Staff Designation</label>
                  <Input
                    readOnly
                    value={getSelEmployeeDesignation()}
                    style={{ width: "100%", backgroundColor: "#ede7e7ff" }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Modal>
      <Modal
        title="Edit staff detail"
        open={editModal}
        onCancel={() => setEditModal(false)}
        okText="Update"
        onOk={editStaff}
        confirmLoading={loader}
      >
        <Card>
          <Row>
            <Col span={24}>
              <Row>
                <Col md={11}>
                  <label>
                    Username<label className="text-danger">*</label>
                  </label>
                  <Input
                    value={editData["username"]}
                    onChange={(e) => {
                      const username = e.target.value.toLowerCase();
                      setEditData((item) => ({ ...item, username }));
                    }}
                    style={{ width: "100%" }}
                    placeholder="Enter username..."
                  />
                </Col>
                <Col md={2}></Col>
                <Col md={11}>
                  <label>
                    Password<label className="text-danger">*</label>
                  </label>
                  <Input
                    value={editData["password"]}
                    onChange={(e) => {
                      const password = e.target.value;
                      setEditData((item) => ({ ...item, password }));
                    }}
                    style={{ width: "100%" }}
                    placeholder="Enter password..."
                  />
                </Col>
                <Col md={24} className="mt-2">
                  <label>Linked Staff Name</label>
                  <Input
                    readOnly
                    value={editData["emp_name"]}
                    style={{ width: "100%", backgroundColor: "#ede7e7ff" }}
                  />
                </Col>
                <Col md={24} className="mt-2">
                  <label>Staff Designation</label>
                  <Input
                    readOnly
                    value={editData["emp_designation"]}
                    style={{ width: "100%", backgroundColor: "#ede7e7ff" }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Modal> */}
    </>
  );
};

export default UsersMenu;
