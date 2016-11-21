<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/site">
    <ul class="sitemap xoxo">
      <li>
        <xsl:element name="a">
          <xsl:attribute name="href"><xsl:value-of
select="/site/page/link"/></xsl:attribute>
          
          <xsl:value-of select="/site/page/title"/>
        </xsl:element>
        <xsl:for-each select="page">
          <xsl:call-template name="list"/>
        </xsl:for-each>
      </li>
    </ul>
  </xsl:template>
  
  <xsl:template name="list">
    <xsl:if test="count(child::page) > 0"> 
      <ul>
        <xsl:for-each select="page [not(@type = 'utility')]">
          <li>
            <xsl:element name="a">
              <xsl:attribute name="href"><xsl:value-of
select="link"/></xsl:attribute>
              <xsl:value-of select="title"/>
            </xsl:element>
            <xsl:call-template name="list"/></li>
        </xsl:for-each>
      </ul>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>