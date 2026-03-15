import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

// 部门数据类型
interface Department {
  id: number;
  parentId: number;
  deptName: string;
  sortOrder: number;
  status: 'active' | 'inactive';
  createTime: string;
  children?: Department[];
}

// 模拟数据 - 树形结构
const initialDepartments: Department[] = [
  {
    id: 1,
    parentId: 0,
    deptName: '总公司',
    sortOrder: 1,
    status: 'active',
    createTime: '2024-01-01',
    children: [
      {
        id: 2,
        parentId: 1,
        deptName: '技术部',
        sortOrder: 1,
        status: 'active',
        createTime: '2024-01-02',
        children: [
          { id: 6, parentId: 2, deptName: '前端组', sortOrder: 1, status: 'active', createTime: '2024-01-06' },
          { id: 7, parentId: 2, deptName: '后端组', sortOrder: 2, status: 'active', createTime: '2024-01-07' },
          { id: 8, parentId: 2, deptName: '测试组', sortOrder: 3, status: 'active', createTime: '2024-01-08' },
        ],
      },
      {
        id: 3,
        parentId: 1,
        deptName: '市场部',
        sortOrder: 2,
        status: 'active',
        createTime: '2024-01-03',
        children: [
          { id: 9, parentId: 3, deptName: '营销组', sortOrder: 1, status: 'active', createTime: '2024-01-09' },
          { id: 10, parentId: 3, deptName: '推广组', sortOrder: 2, status: 'active', createTime: '2024-01-10' },
        ],
      },
      {
        id: 4,
        parentId: 1,
        deptName: '销售部',
        sortOrder: 3,
        status: 'active',
        createTime: '2024-01-04',
        children: [],
      },
      {
        id: 5,
        parentId: 1,
        deptName: '财务部',
        sortOrder: 4,
        status: 'active',
        createTime: '2024-01-05',
        children: [],
      },
    ],
  },
];

// 递归渲染树形节点
const renderTree = (
  node: Department,
  _selectedId: number | null,
  _onSelect: (id: number) => void,
  onEdit: (dept: Department) => void,
  onDelete: (dept: Department) => void
) => {
  return (
    <TreeItem
      key={node.id}
      itemId={String(node.id)}
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {node.children && node.children.length > 0 ? (
              <FolderIcon color="primary" />
            ) : (
              <FolderIcon sx={{ color: 'text.secondary' }} />
            )}
            <Typography variant="body2" sx={{ fontWeight: node.children && node.children.length > 0 ? 600 : 400 }}>
              {node.deptName}
            </Typography>
            <Chip
              label={node.status === 'active' ? '启用' : '禁用'}
              color={node.status === 'active' ? 'success' : 'default'}
              size="small"
              sx={{ height: 20 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(node); }}>
              <EditIcon fontSize="small" />
            </IconButton>
            {node.parentId !== 0 && (
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(node); }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      }
    />
  );
};

// 递归渲染部门选择器
const renderDepartmentSelect = (departments: Department[], level: number = 0): React.JSX.Element[] => {
  return departments.flatMap((dept) => [
    <MenuItem key={dept.id} value={dept.id} sx={{ pl: level * 2 }}>
      {level > 0 && '└─ '}{dept.deptName}
    </MenuItem>,
    ...(dept.children ? renderDepartmentSelect(dept.children, level + 1) : []),
  ]) as React.JSX.Element[];
};

// 递归查找部门
const findDepartment = (departments: Department[], id: number): Department | null => {
  for (const dept of departments) {
    if (dept.id === id) return dept;
    if (dept.children) {
      const found = findDepartment(dept.children, id);
      if (found) return found;
    }
  }
  return null;
};

// 递归更新部门
const updateDepartment = (
  departments: Department[],
  updatedDept: Department
): Department[] => {
  return departments.map((dept) => {
    if (dept.id === updatedDept.id) {
      return { ...dept, ...updatedDept };
    }
    if (dept.children) {
      return { ...dept, children: updateDepartment(dept.children, updatedDept) };
    }
    return dept;
  });
};

// 递归删除部门
const deleteDepartmentFromTree = (
  departments: Department[],
  id: number
): Department[] => {
  return departments
    .filter((dept) => dept.id !== id)
    .map((dept) => ({
      ...dept,
      children: dept.children ? deleteDepartmentFromTree(dept.children, id) : undefined,
    }));
};

// 递归添加部门
const addDepartmentToTree = (
  departments: Department[],
  newDept: Department
): Department[] => {
  if (newDept.parentId === 0) {
    return [...departments, newDept];
  }
  return departments.map((dept) => {
    if (dept.id === newDept.parentId) {
      return {
        ...dept,
        children: [...(dept.children || []), newDept],
      };
    }
    if (dept.children) {
      return {
        ...dept,
        children: addDepartmentToTree(dept.children, newDept),
      };
    }
    return dept;
  });
};

export const DepartmentList: React.FC = () => {
  const theme = useTheme();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentDept, setCurrentDept] = useState<Department | null>(null);
  const [searchText, setSearchText] = useState('');

  // 表单状态
  const [formData, setFormData] = useState({
    parentId: '0',
    deptName: '',
    sortOrder: 1,
    status: 'active' as 'active' | 'inactive',
  });

  // 处理选择节点
  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  // 处理编辑
  const handleEdit = (dept: Department) => {
    setDialogType('edit');
    setCurrentDept(dept);
    setFormData({
      parentId: String(dept.parentId),
      deptName: dept.deptName,
      sortOrder: dept.sortOrder,
      status: dept.status as 'active' | 'inactive',
    });
    setDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (dept: Department) => {
    if (window.confirm(`确定要删除部门 "${dept.deptName}" 吗？`)) {
      setDepartments(deleteDepartmentFromTree(departments, dept.id));
    }
  };

  // 处理新增
  const handleAdd = () => {
    setDialogType('add');
    setCurrentDept(null);
    setFormData({
      parentId: String(selectedId || 0),
      deptName: '',
      sortOrder: 1,
      status: 'active',
    });
    setDialogOpen(true);
  };

  // 处理表单提交
  const handleSubmit = () => {
    if (!formData.deptName) {
      alert('请填写部门名称');
      return;
    }

    if (dialogType === 'add') {
      const newDept: Department = {
        id: Math.max(...departments.flatMap((d) => [d.id, ...(d.children?.map((c) => c.id) || [])])) + 1,
        ...formData,
        parentId: Number(formData.parentId),
        createTime: dayjs().format('YYYY-MM-DD'),
        children: [],
      };
      setDepartments(addDepartmentToTree(departments, newDept));
    } else if (dialogType === 'edit' && currentDept) {
      const updatedDept: Department = {
        ...currentDept,
        ...formData,
        parentId: currentDept.parentId,
      };
      setDepartments(updateDepartment(departments, updatedDept));
    }
    setDialogOpen(false);
  };

  // 扁平化部门列表用于搜索显示
  const flattenDepartments = (depts: Department[]): Department[] => {
    return depts.flatMap((dept) => [dept, ...(dept.children ? flattenDepartments(dept.children) : [])]);
  };

  return (
    <Box>
      {/* 页面标题 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            部门管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            管理组织架构，包括部门增删改查
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            刷新
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            新增部门
          </Button>
        </Box>
      </Box>

      {/* 搜索栏 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="搜索部门名称"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* 左侧树形结构 */}
        <Card sx={{ flex: 1, minWidth: 400 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              组织架构
            </Typography>
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ flexGrow: 1 }}
            >
              {departments.map((dept) =>
                renderTree(dept, selectedId, handleSelect, handleEdit, handleDelete)
              )}
            </TreeView>
          </CardContent>
        </Card>

        {/* 右侧详情/操作 */}
        <Card sx={{ width: 300 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              {selectedId ? '部门详情' : '选择部门查看'}
            </Typography>
            {selectedId && (() => {
              const dept = findDepartment(departments, selectedId);
              if (!dept) return <Typography color="text.secondary">未找到部门</Typography>;

              const parentDept = dept.parentId !== 0
                ? findDepartment(departments, dept.parentId)
                : null;

              return (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      部门名称
                    </Typography>
                    <Typography variant="h6">{dept.deptName}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      上级部门
                    </Typography>
                    <Typography variant="body1">
                      {parentDept ? parentDept.deptName : '无（顶级部门）'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      排序
                    </Typography>
                    <Typography variant="body1">{dept.sortOrder}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      状态
                    </Typography>
                    <Chip
                      label={dept.status === 'active' ? '启用' : '禁用'}
                      color={dept.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      创建时间
                    </Typography>
                    <Typography variant="body1">{dept.createTime}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      fullWidth
                      onClick={() => handleEdit(dept)}
                    >
                      编辑
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      下级部门
                    </Typography>
                    {dept.children && dept.children.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {dept.children.map((child) => (
                          <Chip
                            key={child.id}
                            label={child.deptName}
                            size="small"
                            clickable
                            onClick={() => handleSelect(child.id)}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        无下级部门
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })()}
          </CardContent>
        </Card>
      </Box>

      {/* 新增/编辑/查看 对话框 */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'add' && '新增部门'}
          {dialogType === 'edit' && '编辑部门'}
          {dialogType === 'view' && '部门详情'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>上级部门</InputLabel>
              <Select
                value={formData.parentId}
                label="上级部门"
                onChange={(e: SelectChangeEvent) =>
                  setFormData({ ...formData, parentId: e.target.value })
                }
                disabled={dialogType === 'edit'}
              >
                <MenuItem value="0">顶级部门</MenuItem>
                {renderDepartmentSelect(departments)}
              </Select>
            </FormControl>
            <TextField
              label="部门名称"
              value={formData.deptName}
              onChange={(e) => setFormData({ ...formData, deptName: e.target.value })}
              disabled={dialogType === 'view'}
              fullWidth
              required
            />
            <TextField
              label="排序"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              disabled={dialogType === 'view'}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'active'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked ? ('active' as 'active' | 'inactive') : ('inactive' as 'active' | 'inactive') })
                  }
                  disabled={dialogType === 'view'}
                />
              }
              label="启用"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          {dialogType !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              确定
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentList;
