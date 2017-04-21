/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.hadoop.ssm.rule.objects;


import org.apache.hadoop.ssm.rule.parser.ValueType;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Definition of rule object 'File'.
 */
public class File extends SSMObject {

  public static final Map<String, Property> properties;

  static {
    properties = new HashMap<>();
    properties.put("path", new Property(ValueType.STRING, null, "files", "path", false));
    properties.put("accessCount",
        new Property(ValueType.LONG, Arrays.asList(ValueType.TIMEINTVAL), "access_count_table", "", false,
            "start_time >= NOW - $0 AND end_time <= NOW"));
    properties.put("length", new Property(ValueType.LONG, null, "files", "length", false));
    properties.put("blocksize", new Property(ValueType.LONG, null, "files", "block_size", false));
    properties.put("inCache", new Property(ValueType.BOOLEAN, null, "cached_files", null, false));
  }

  public File() {
    super(ObjectType.FILE);
  }

  public Map<String, Property> getProperties() {
    return properties;
  }
}