package com.enterprise.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.enterprise.entity.Config;
import org.apache.ibatis.annotations.Mapper;

/**
 * 参数配置 Mapper 接口
 */
@Mapper
public interface ConfigMapper extends BaseMapper<Config> {
}
