<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:strip-space elements="page" />
  <xsl:param name="this_page" />
  <xsl:template match="site">
  
    <xsl:for-each select="//page/page/page[link = $this_page]">
      <xsl:call-template name="list" />
    </xsl:for-each>
  </xsl:template>
  
  
  
  <xsl:template name="list">
    <xsl:choose>
      <xsl:when test="descendant-or-self::page[not(@type = 'utility')]">
      <dl class="siblings">
      <dt>
      
      <a>
            <xsl:attribute name="href"><xsl:value-of select="../link"/></xsl:attribute>
            <xsl:value-of select="../title" /></a>
      
      </dt>
                  <dd>
        <ul class="siblings">
          <xsl:for-each select="../page [not(@type = 'utility')]">
            <li>
           
              <xsl:choose>
              
             
                <xsl:when test="link = $this_page">
                  <strong class="current"><xsl:value-of select="title" /></strong>
                </xsl:when>
                
                
                <xsl:otherwise>
                  <a>
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <xsl:value-of select="title" /></a>
                </xsl:otherwise>
              </xsl:choose>
            </li>
          </xsl:for-each>
          
        </ul>
        </dd>
        </dl>
      </xsl:when>
      <xsl:otherwise></xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>