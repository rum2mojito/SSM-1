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
package org.smartdata.integration;

import com.google.gson.Gson;
import io.restassured.RestAssured;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.smartdata.conf.SmartConf;
import org.smartdata.integration.cluster.MiniSmartCluster;
import org.smartdata.integration.cluster.SmartCluster;

/**
 * Integration test.
 */
public class IntegrationTestBase {
  public static final String ROOT = "/smart/api/v1";
  public static final String RULEROOT = ROOT + "/rules";
  public static final String CMDLETROOT = ROOT + "/cmdlets";
  public static final String PRIMCLUSTERROOT = ROOT + "/cluster/primary";

  private static SmartCluster cluster;
  private static SmartConf conf;
  private static IntegrationSmartServer smartServer;
  private static int zeppelinPort;
  private static Gson gson = new Gson();

  @BeforeClass
  public static void setup() throws Exception {
    // Set up an HDFS cluster
    cluster = new MiniSmartCluster();
    cluster.setUp();

    // Start a Smart server
    conf = cluster.getConf();
    zeppelinPort = 8080;
    smartServer = new IntegrationSmartServer();
    smartServer.setUp(conf);

    // Initialize RestAssured
    initRestAssured();
  }

  private static void initRestAssured() {
    RestAssured.port = zeppelinPort;
    //RestAssured.registerParser("text/plain", Parser.JSON);
  }

  @AfterClass
  public static void cleanUp() throws Exception {
    smartServer.cleanUp();
    cluster.cleanUp();
  }
}
